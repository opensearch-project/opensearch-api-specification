/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

/**
 * Inject OpenSearch client code samples (`x-codeSamples`) into every operation
 * of a built spec.
 *
 * Scalar auto-generates GENERIC HTTP-client snippets (requests, axios, okhttp,
 * ...) that have nothing to do with OpenSearch. This pass replaces that with a
 * curated, uniform set of samples that use each OFFICIAL OpenSearch client
 * library's low-level transport escape hatch -- the one call that works for ANY
 * endpoint given (method, path, body). index.html sets `hiddenClients: true`, so
 * the generated snippets are hidden and only these custom samples render.
 *
 * Low-level (not idiomatic) is deliberate: a single mechanical template per
 * client covers all ~700 operations. The high-level clients expose typed helpers
 * but there is no per-operation mapping here -- the transport call is uniform and
 * always correct.
 *
 * Languages == the distributions' official clients:
 * curl (raw REST), Python, JavaScript/Node, Java, Go, Ruby, PHP, C# (.NET), Rust.
 *
 * Usage: ts-node docs/enrich.ts <spec.yaml|spec.json> <output.yaml|output.json> [--auth=basic|sigv4]
 *   Reads a YAML or JSON spec, injects x-codeSamples, writes YAML or JSON --
 *   whichever the output file's extension (.yaml/.yml vs .json) selects.
 *   --auth selects the credential style shown in every sample (default: basic).
 *   Use --auth=sigv4 for distributions that only support AWS SigV4/IAM auth,
 *   such as Amazon OpenSearch Serverless (AOSS) -- it has no basic-auth surface,
 *   so a basic-auth sample would not work against it.
 */
import { readFileSync, writeFileSync } from 'fs'
import YAML from 'yaml'

const HTTP_METHODS = new Set(['get', 'post', 'put', 'delete', 'head', 'patch'])

type AuthMode = 'basic' | 'sigv4'

// Auth placeholders shown in every sample. Deliberately NOT real credentials --
// the reader must substitute their own. Angle-bracket placeholders (not the
// OpenSearch dev default "admin:admin") so no sample copies verbatim into prod.
const USERNAME = '<username>'
const PASSWORD = '<password>'

// Placeholders for the SigV4 samples. AOSS has no concept of a cluster
// endpoint host the reader can autofill (it's a per-collection endpoint), so
// unlike the basic-auth samples' fixed localhost:9200, these stay symbolic.
const AWS_ENDPOINT = '<aoss-collection-endpoint>'
const AWS_REGION = '<aws-region>'
const AWS_SERVICE = 'aoss'

// Example values substituted for `{path_param}` placeholders so sample paths
// look like real requests. Unknown params fall back to the param name itself.
const PATH_PARAM_EXAMPLES: Record<string, string> = {
  index: 'my-index',
  id: '1',
  name: 'my-name',
  repository: 'my-repo',
  snapshot: 'my-snapshot',
  target: 'my-target',
  alias: 'my-alias',
  field: 'my-field',
  policy_id: 'my-policy',
  task_id: 'task-1'
}

// Placeholder request body note. No per-operation body is synthesized; a
// POST/PUT shows an empty JSON object the reader replaces with their payload.
const BODY_NOTE = 'replace with your request body'

/** `/{index}/_search` -> `/my-index/_search`. */
function example_path (path: string): string {
  return path.replace(/\{([^}]+)\}/g, (_m, name: string) => PATH_PARAM_EXAMPLES[name] ?? name)
}

// --- Per-client renderers --------------------------------------------------
// Each takes (method, path, has_body) -> source string. `method` is upper-case
// (e.g. "POST"); `path` is the concrete example path; `has_body` says whether
// the operation declares a requestBody.
//
// Each client exposes both a basic-auth renderer and a SigV4 renderer, since
// the two auth styles need genuinely different client setup code (not just a
// swapped credential value) -- SigV4 needs a signer/region/service, not a
// username/password.

type Renderer = (method: string, path: string, has_body: boolean) => string

const curl_sample: Renderer = (method, path, has_body) => {
  const body = has_body
    ? ` \\\n  -H 'Content-Type: application/json' \\\n  -d '{}'  # ${BODY_NOTE}`
    : ''
  return `curl -X ${method} 'https://localhost:9200${path}' \\\n  -u ${USERNAME}:${PASSWORD} -k${body}`
}

const curl_sample_sigv4: Renderer = (method, path, has_body) => {
  // SigV4-sign the request with awscurl (curl has no native SigV4 support).
  const body = has_body
    ? ` \\\n  -H 'Content-Type: application/json' \\\n  -d '{}'  # ${BODY_NOTE}`
    : ''
  return (
    '# Requires awscurl (pip install awscurl); credentials are read from the\n' +
    '# standard AWS credential chain (env vars, ~/.aws/credentials, etc.).\n' +
    `awscurl --service ${AWS_SERVICE} --region ${AWS_REGION} \\\n` +
    `  -X ${method} 'https://${AWS_ENDPOINT}${path}'${body}`
  )
}

const python_sample: Renderer = (method, path, has_body) => {
  // opensearch-py: client.transport.perform_request(method, url, params, body, ...)
  const body = has_body ? `\n    body={},  # ${BODY_NOTE}` : ''
  return (
    'from opensearchpy import OpenSearch\n\n' +
    'client = OpenSearch(\n' +
    '    hosts=[{"host": "localhost", "port": 9200}],\n' +
    `    http_auth=("${USERNAME}", "${PASSWORD}"),\n` +
    '    use_ssl=True,\n' +
    '    verify_certs=False,\n' +
    ')\n\n' +
    'response = client.transport.perform_request(\n' +
    `    method="${method}",\n` +
    `    url="${path}",${body}\n` +
    ')\n' +
    'print(response)'
  )
}

const python_sample_sigv4: Renderer = (method, path, has_body) => {
  // opensearch-py: RequestsAWSV4SignerAuth + RequestsHttpConnection, service="aoss".
  const body = has_body ? `\n    body={},  # ${BODY_NOTE}` : ''
  return (
    'import boto3\n' +
    'from opensearchpy import OpenSearch, RequestsHttpConnection, RequestsAWSV4SignerAuth\n\n' +
    'credentials = boto3.Session().get_credentials()\n' +
    `auth = RequestsAWSV4SignerAuth(credentials, "${AWS_REGION}", "${AWS_SERVICE}")\n\n` +
    'client = OpenSearch(\n' +
    `    hosts=[{"host": "${AWS_ENDPOINT}", "port": 443}],\n` +
    '    http_auth=auth,\n' +
    '    use_ssl=True,\n' +
    '    verify_certs=True,\n' +
    '    connection_class=RequestsHttpConnection,\n' +
    ')\n\n' +
    'response = client.transport.perform_request(\n' +
    `    method="${method}",\n` +
    `    url="${path}",${body}\n` +
    ')\n' +
    'print(response)'
  )
}

const js_sample: Renderer = (method, path, has_body) => {
  // opensearch-js: client.transport.request({ method, path, querystring, body })
  const body = has_body ? `\n  body: {},  // ${BODY_NOTE}` : ''
  return (
    'const { Client } = require("@opensearch-project/opensearch");\n\n' +
    'const client = new Client({\n' +
    `  node: "https://${USERNAME}:${PASSWORD}@localhost:9200",\n` +
    '  ssl: { rejectUnauthorized: false },\n' +
    '});\n\n' +
    'const response = await client.transport.request({\n' +
    `  method: "${method}",\n` +
    `  path: "${path}",${body}\n` +
    '});\n' +
    'console.log(response.body);'
  )
}

const js_sample_sigv4: Renderer = (method, path, has_body) => {
  // opensearch-js: AwsSigv4Signer with the AWS SDK v3 default credential provider.
  const body = has_body ? `\n  body: {},  // ${BODY_NOTE}` : ''
  return (
    'const { defaultProvider } = require("@aws-sdk/credential-provider-node");\n' +
    'const { Client } = require("@opensearch-project/opensearch");\n' +
    'const { AwsSigv4Signer } = require("@opensearch-project/opensearch/aws");\n\n' +
    'const client = new Client({\n' +
    '  ...AwsSigv4Signer({\n' +
    `    region: "${AWS_REGION}",\n` +
    `    service: "${AWS_SERVICE}",\n` +
    '    getCredentials: () => defaultProvider()(),\n' +
    '  }),\n' +
    `  node: "https://${AWS_ENDPOINT}",\n` +
    '});\n\n' +
    'const response = await client.transport.request({\n' +
    `  method: "${method}",\n` +
    `  path: "${path}",${body}\n` +
    '});\n' +
    'console.log(response.body);'
  )
}

const java_sample: Renderer = (method, path, has_body) => {
  // Low-level org.opensearch.client.RestClient (opensearch-rest-client artifact).
  const body = has_body ? `\nrequest.setJsonEntity("{}");  // ${BODY_NOTE}` : ''
  return (
    'BasicCredentialsProvider creds = new BasicCredentialsProvider();\n' +
    'creds.setCredentials(AuthScope.ANY,\n' +
    `    new UsernamePasswordCredentials("${USERNAME}", "${PASSWORD}"));\n\n` +
    'RestClient restClient = RestClient\n' +
    '    .builder(new HttpHost("localhost", 9200, "https"))\n' +
    '    .setHttpClientConfigCallback(cb -> cb.setDefaultCredentialsProvider(creds))\n' +
    '    .build();\n\n' +
    `Request request = new Request("${method}", "${path}");${body}\n` +
    'Response response = restClient.performRequest(request);\n' +
    'System.out.println(EntityUtils.toString(response.getEntity()));'
  )
}

const java_sample_sigv4: Renderer = (method, path, has_body) => {
  // opensearch-java: AwsSdk2Transport (native SigV4, supports AOSS since 2.2).
  const body = has_body ? `\nrequest.setJsonEntity("{}");  // ${BODY_NOTE}` : ''
  return (
    'SdkHttpClient httpClient = ApacheHttpClient.builder().build();\n' +
    'OpenSearchClient client = new OpenSearchClient(\n' +
    '    new AwsSdk2Transport(\n' +
    '        httpClient,\n' +
    `        "${AWS_ENDPOINT}",\n` +
    `        "${AWS_SERVICE}",\n` +
    `        Region.of("${AWS_REGION}"),\n` +
    '        AwsSdk2TransportOptions.builder().build()\n' +
    '    )\n' +
    ');\n\n' +
    `Request request = new Request("${method}", "${path}");${body}\n` +
    '// AwsSdk2Transport signs and sends via the underlying REST client:\n' +
    'Response response = client._transport().restClient().performRequest(request);\n' +
    'System.out.println(EntityUtils.toString(response.getEntity()));'
  )
}

const go_sample: Renderer = (method, path, has_body) => {
  // opensearch-go v2: client.Perform(*http.Request). v4/main renames it to
  // client.Request(*http.Request) -- noted inline.
  const imports = ['\t"crypto/tls"', '\t"net/http"']
  if (has_body) imports.push('\t"strings"')
  imports.push('\n\t"github.com/opensearch-project/opensearch-go/v2"')
  const body_arg = has_body ? 'strings.NewReader(`{}`)' : 'nil'
  const ctype = has_body ? `\nreq.Header.Set("Content-Type", "application/json")  // ${BODY_NOTE}` : ''
  return (
    'import (\n' + imports.join('\n') + '\n)\n\n' +
    'client, _ := opensearch.NewClient(opensearch.Config{\n' +
    '    Addresses: []string{"https://localhost:9200"},\n' +
    `    Username:  "${USERNAME}",\n` +
    `    Password:  "${PASSWORD}",\n` +
    '    Transport: &http.Transport{\n' +
    '        TLSClientConfig: &tls.Config{InsecureSkipVerify: true},\n' +
    '    },\n' +
    '})\n\n' +
    `req, _ := http.NewRequest("${method}", "${path}", ${body_arg})${ctype}\n` +
    'resp, _ := client.Perform(req)  // opensearch-go v4/main: client.Request(req)\n' +
    'defer resp.Body.Close()'
  )
}

const go_sample_sigv4: Renderer = (method, path, has_body) => {
  // opensearch-go v2: signer/awsv2 request signer, backed by aws-sdk-go-v2's
  // default credential chain. NewSignerWithService sets the SigV4 service name
  // explicitly ("aoss" for OpenSearch Serverless, "es" for managed domains).
  const imports = ['\t"context"', '\t"net/http"']
  if (has_body) imports.push('\t"strings"')
  imports.push(
    '\n\t"github.com/aws/aws-sdk-go-v2/config"',
    '\t"github.com/opensearch-project/opensearch-go/v2"',
    '\trequestsigner "github.com/opensearch-project/opensearch-go/v2/signer/awsv2"'
  )
  const body_arg = has_body ? 'strings.NewReader(`{}`)' : 'nil'
  const ctype = has_body ? `\nreq.Header.Set("Content-Type", "application/json")  // ${BODY_NOTE}` : ''
  return (
    'import (\n' + imports.join('\n') + '\n)\n\n' +
    'cfg, _ := config.LoadDefaultConfig(context.Background(), config.WithRegion("' + AWS_REGION + '"))\n' +
    `signer, _ := requestsigner.NewSignerWithService(cfg, "${AWS_SERVICE}")\n\n` +
    'client, _ := opensearch.NewClient(opensearch.Config{\n' +
    `    Addresses: []string{"https://${AWS_ENDPOINT}"},\n` +
    '    Signer:    signer,\n' +
    '})\n\n' +
    `req, _ := http.NewRequest("${method}", "${path}", ${body_arg})${ctype}\n` +
    'resp, _ := client.Perform(req)  // opensearch-go v4/main: client.Request(req)\n' +
    'defer resp.Body.Close()'
  )
}

const ruby_sample: Renderer = (method, path, has_body) => {
  // opensearch-ruby: client.perform_request(method, path, params = {}, body = nil)
  const body = has_body ? `,\n  {}  # ${BODY_NOTE}` : ''
  const params = has_body ? ',\n  {}' : ''
  return (
    'require "opensearch"\n\n' +
    'client = OpenSearch::Client.new(\n' +
    `  host: "https://${USERNAME}:${PASSWORD}@localhost:9200",\n` +
    '  transport_options: { ssl: { verify: false } }\n' +
    ')\n\n' +
    'response = client.perform_request(\n' +
    `  "${method}",\n` +
    `  "${path}"${params}${body}\n` +
    ')\n' +
    'puts response.body'
  )
}

const ruby_sample_sigv4: Renderer = (method, path, has_body) => {
  // opensearch-aws-sigv4 gem: OpenSearch::Aws::Sigv4Client wraps OpenSearch::Client.
  const body = has_body ? `,\n  {}  # ${BODY_NOTE}` : ''
  const params = has_body ? ',\n  {}' : ''
  return (
    'require "opensearch-aws-sigv4"\n' +
    'require "aws-sigv4"\n\n' +
    'signer = Aws::Sigv4::Signer.new(\n' +
    `  service: "${AWS_SERVICE}",\n` +
    `  region: "${AWS_REGION}",\n` +
    '  credentials: Aws::CredentialProviderChain.new.resolve\n' +
    ')\n\n' +
    'client = OpenSearch::Aws::Sigv4Client.new(\n' +
    `  { host: "https://${AWS_ENDPOINT}", log: false },\n` +
    '  signer\n' +
    ')\n\n' +
    'response = client.perform_request(\n' +
    `  "${method}",\n` +
    `  "${path}"${params}${body}\n` +
    ')\n' +
    'puts response.body'
  )
}

const php_sample: Renderer = (method, path, has_body) => {
  // opensearch-php (2.3+ PSR client): $client->request(method, uri, attributes).
  // NB: an empty JSON object must be (object) [], not [] (which encodes as []).
  const attrs = has_body ? ` [\n    'body' => (object) [],  // ${BODY_NOTE}\n]` : ''
  return (
    "require 'vendor/autoload.php';\n\n" +
    '$client = (new \\OpenSearch\\GuzzleClientFactory())->create([\n' +
    "    'base_uri' => 'https://localhost:9200',\n" +
    `    'auth'     => ['${USERNAME}', '${PASSWORD}'],\n` +
    "    'verify'   => false,\n" +
    ']);\n\n' +
    `$response = $client->request('${method}', '${path}'${attrs ? ',' + attrs : ''});\n` +
    'print_r($response);'
  )
}

const php_sample_sigv4: Renderer = (method, path, has_body) => {
  // opensearch-php: ClientBuilder::setSigV4Region/setSigV4CredentialProvider/setSigV4Service.
  const attrs = has_body ? ` [\n    'body' => (object) [],  // ${BODY_NOTE}\n]` : ''
  return (
    "require_once __DIR__ . '/vendor/autoload.php';\n\n" +
    '$client = (new \\OpenSearch\\ClientBuilder())\n' +
    `    ->setHosts(["https://${AWS_ENDPOINT}"])\n` +
    `    ->setSigV4Region("${AWS_REGION}")\n` +
    `    ->setSigV4Service("${AWS_SERVICE}")\n` +
    '    ->setSigV4CredentialProvider(true)\n' +
    '    ->build();\n\n' +
    `$response = $client->request('${method}', '${path}'${attrs ? ',' + attrs : ''});\n` +
    'print_r($response);'
  )
}

const csharp_sample: Renderer = (method, path, has_body) => {
  // OpenSearch.Net low-level: client.DoRequest<StringResponse>(HttpMethod, path, PostData?)
  // The `;` terminator must precede the trailing comment, else it is commented out.
  const body = has_body ? `,\n    PostData.String("{}"));  // ${BODY_NOTE}` : ');'
  return (
    'using OpenSearch.Net;\n\n' +
    'var pool = new SingleNodeConnectionPool(new Uri("https://localhost:9200"));\n' +
    'var settings = new ConnectionConfiguration(pool)\n' +
    `    .BasicAuthentication("${USERNAME}", "${PASSWORD}")\n` +
    '    .ServerCertificateValidationCallback((o, cert, chain, errors) => true);\n\n' +
    'var client = new OpenSearchLowLevelClient(settings);\n\n' +
    'var response = client.DoRequest<StringResponse>(\n' +
    `    HttpMethod.${method},\n` +
    `    "${path}"${body}\n` +
    'Console.WriteLine(response.Body);'
  )
}

const csharp_sample_sigv4: Renderer = (method, path, has_body) => {
  // OpenSearch.Net: AwsSigV4HttpConnection, region/service via AwsSigV4HttpConnection ctor overload.
  const body = has_body ? `,\n    PostData.String("{}"));  // ${BODY_NOTE}` : ');'
  return (
    'using OpenSearch.Client;\n' +
    'using OpenSearch.Net.Auth.AwsSigV4;\n\n' +
    `var endpoint = new Uri("https://${AWS_ENDPOINT}");\n` +
    `var connection = new AwsSigV4HttpConnection(service: "${AWS_SERVICE}", region: "${AWS_REGION}");\n` +
    'var settings = new ConnectionConfiguration(endpoint, connection);\n' +
    'var client = new OpenSearchLowLevelClient(settings);\n\n' +
    'var response = client.DoRequest<StringResponse>(\n' +
    `    HttpMethod.${method},\n` +
    `    "${path}"${body}\n` +
    'Console.WriteLine(response.Body);'
  )
}

const rust_sample: Renderer = (method, path, has_body) => {
  // opensearch-rs: client.send(method, path, headers, query, body, timeout).
  // Method is PascalCase (Method::Post). Body: Some(String) or None::<String>.
  const m = method.charAt(0) + method.slice(1).toLowerCase() // POST -> Post
  const body = has_body ? `Some(r#"{}"#),  // ${BODY_NOTE}` : 'None::<String>,'
  return (
    'use opensearch::{\n' +
    '    OpenSearch,\n' +
    '    auth::Credentials,\n' +
    '    cert::CertificateValidation,\n' +
    '    http::{Method, headers::HeaderMap,\n' +
    '        transport::{SingleNodeConnectionPool, TransportBuilder}},\n' +
    '};\n' +
    'use url::Url;\n\n' +
    'let pool = SingleNodeConnectionPool::new(Url::parse("https://localhost:9200")?);\n' +
    'let transport = TransportBuilder::new(pool)\n' +
    `    .auth(Credentials::Basic("${USERNAME}".into(), "${PASSWORD}".into()))\n` +
    '    .cert_validation(CertificateValidation::None)\n' +
    '    .build()?;\n' +
    'let client = OpenSearch::new(transport);\n\n' +
    'let response = client.send(\n' +
    `    Method::${m},\n` +
    `    "${path}",\n` +
    '    HeaderMap::new(),\n' +
    '    Option::<&()>::None,\n' +
    `    ${body}\n` +
    '    None,\n' +
    ').await?;'
  )
}

const rust_sample_sigv4: Renderer = (method, path, has_body) => {
  // opensearch-rs: Credentials::AwsSigV4 built from an aws-config SdkConfig.
  const m = method.charAt(0) + method.slice(1).toLowerCase() // POST -> Post
  const body = has_body ? `Some(r#"{}"#),  // ${BODY_NOTE}` : 'None::<String>,'
  return (
    'use opensearch::{\n' +
    '    OpenSearch,\n' +
    '    cert::CertificateValidation,\n' +
    '    http::{Method, headers::HeaderMap,\n' +
    '        transport::{SingleNodeConnectionPool, TransportBuilder}},\n' +
    '};\n' +
    'use url::Url;\n\n' +
    `let url = Url::parse("https://${AWS_ENDPOINT}")?;\n` +
    'let pool = SingleNodeConnectionPool::new(url);\n' +
    `let aws_config = aws_config::from_env().region("${AWS_REGION}").load().await;\n` +
    `// opensearch-rs derives the SigV4 service name from the SDK config;\n` +
    `// .service_name("${AWS_SERVICE}") overrides the default "es".\n` +
    'let transport = TransportBuilder::new(pool)\n' +
    `    .service_name("${AWS_SERVICE}")\n` +
    '    .auth(aws_config.clone().try_into()?)\n' +
    '    .cert_validation(CertificateValidation::None)\n' +
    '    .build()?;\n' +
    'let client = OpenSearch::new(transport);\n\n' +
    'let response = client.send(\n' +
    `    Method::${m},\n` +
    `    "${path}",\n` +
    '    HeaderMap::new(),\n' +
    '    Option::<&()>::None,\n' +
    `    ${body}\n` +
    '    None,\n' +
    ').await?;'
  )
}

interface Client { lang: string, label: string, render: Renderer, render_sigv4: Renderer }

const CLIENTS: Client[] = [
  { lang: 'bash', label: 'curl', render: curl_sample, render_sigv4: curl_sample_sigv4 },
  { lang: 'python', label: 'Python (opensearch-py)', render: python_sample, render_sigv4: python_sample_sigv4 },
  { lang: 'javascript', label: 'JavaScript (opensearch-js)', render: js_sample, render_sigv4: js_sample_sigv4 },
  { lang: 'java', label: 'Java (opensearch-java)', render: java_sample, render_sigv4: java_sample_sigv4 },
  { lang: 'go', label: 'Go (opensearch-go)', render: go_sample, render_sigv4: go_sample_sigv4 },
  { lang: 'ruby', label: 'Ruby (opensearch-ruby)', render: ruby_sample, render_sigv4: ruby_sample_sigv4 },
  { lang: 'php', label: 'PHP (opensearch-php)', render: php_sample, render_sigv4: php_sample_sigv4 },
  { lang: 'csharp', label: 'C# (OpenSearch.Net)', render: csharp_sample, render_sigv4: csharp_sample_sigv4 },
  { lang: 'rust', label: 'Rust (opensearch-rs)', render: rust_sample, render_sigv4: rust_sample_sigv4 }
]

function build_samples (method: string, path: string, has_body: boolean, auth: AuthMode): Array<{ lang: string, label: string, source: string }> {
  const concrete = example_path(path)
  return CLIENTS.map((c) => ({ lang: c.lang, label: c.label, source: (auth === 'sigv4' ? c.render_sigv4 : c.render)(method, concrete, has_body) }))
}

function process_spec (spec: Record<string, any>, auth: AuthMode): number {
  let count = 0
  const paths: Record<string, any> = spec.paths ?? {}
  for (const [path, methods] of Object.entries(paths)) {
    if (typeof methods !== 'object' || methods === null) continue
    const method_map = methods as Record<string, any>
    for (const method of Object.keys(method_map)) {
      if (!HTTP_METHODS.has(method)) continue
      const op = method_map[method]
      if (typeof op !== 'object' || op === null) continue
      const has_body = typeof op.requestBody === 'object' && op.requestBody !== null
      op['x-codeSamples'] = build_samples(method.toUpperCase(), path, has_body, auth)
      count++
    }
  }
  return count
}

function main (): void {
  const flags = process.argv.slice(2).filter((a) => a.startsWith('--'))
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
  if (args.length < 2) {
    console.error('Usage: ts-node docs/enrich.ts <spec.yaml|spec.json> <output.yaml|output.json> [--auth=basic|sigv4]')
    process.exit(1)
  }
  const src = args[0]
  const dst = args[1]

  const auth_flag = flags.find((f) => f.startsWith('--auth='))?.split('=')[1] ?? 'basic'
  if (auth_flag !== 'basic' && auth_flag !== 'sigv4') {
    console.error(`ERROR: invalid --auth value: ${auth_flag} (expected "basic" or "sigv4")`)
    process.exit(1)
  }
  const auth: AuthMode = auth_flag

  const raw = readFileSync(src, 'utf-8')
  // YAML.parse also parses JSON (JSON is a subset of YAML), so this handles both.
  const spec = YAML.parse(raw) as Record<string, any> | null | undefined
  if (spec === null || spec === undefined) {
    console.error(`ERROR: empty/invalid spec: ${src}`)
    process.exit(1)
  }
  const n = process_spec(spec, auth)
  const is_yaml = /\.ya?ml$/i.test(dst)
  writeFileSync(dst, is_yaml ? YAML.stringify(spec) : JSON.stringify(spec))

  console.log(`  x-codeSamples: injected ${CLIENTS.length} client samples (auth=${auth}) into ${n} operations -> ${dst}`)
}

main()
