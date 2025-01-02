import os
import subprocess
import tempfile
from preprocessing import preprocess_openapi
from git import Repo
import argparse
import yaml
import re

REPO_URL = "https://github.com/lucy66hw/openapi-generator.git"

def clone_build(repo_url, branch_name="master"):
    """
    Clones the repository, builds it with maven, and runs the generated JAR.

    Args:
        repo_url (str): URL of the Git repository to clone.
        branch_name (str): Branch to checkout.
    """
    clone_dir = tempfile.mkdtemp(dir=temp_dir)

    try:
        print(f"Cloning repository into: {clone_dir}")
        repo = Repo.clone_from(repo_url, clone_dir)
        print(f"Checking out branch: {branch_name}")
        repo.git.checkout(branch_name)

        print("Building the project with Maven...")
        subprocess.run(["./mvnw", "clean", "install"], cwd=clone_dir, check=True)

        jar_path = os.path.join(clone_dir, "modules", "openapi-generator-cli", "target", "openapi-generator-cli.jar")
        if not os.path.exists(jar_path):
            raise FileNotFoundError(f"JAR file not found: {jar_path}")

        return jar_path

    except FileNotFoundError as fnf_error:
        print(f"File error: {fnf_error}")
        raise
    except subprocess.CalledProcessError as proc_error:
        print(f"Process error during Maven or JAR execution: {proc_error}")
        raise
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise

def convert_proto(jar_path, jar_args=None):
    jar_args = jar_args or []
    print(f"Running the JAR: {jar_path}")
    subprocess.run(["java", "-jar", jar_path] + jar_args, check=True)

def run_merger_script(ts_file, source, output):
    try:
        result = subprocess.run(
            ["ts-node", ts_file, "--source", source, "--output", output],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True
        )
        print("Output from TypeScript script:")
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print("Error while running TypeScript script:")
        print(e.stderr)

def get_git_root(current_path="."):
    try:
        repo = Repo(current_path, search_parent_directories=True)
        return repo.git.rev_parse("--show-toplevel")
    except Exception as e:
        print(f"Error determining Git root: {e}")
        raise

def get_openapi_paths(openapi_file):
    try:
        with open(openapi_file, 'r') as file:
            spec = yaml.safe_load(file)

        paths = spec.get("paths", {})

        return list(paths.keys())
    except Exception as e:
        print(f"Error reading OpenAPI file {openapi_file}: {e}")
        return []

def sanitize_path_name(path):
    parts = path.split("/")

    sanitized_parts = [re.sub(r'\W+', '', part).strip("_") for part in parts]

    snake_case = "_".join(filter(None, sanitized_parts))
    if snake_case == "":
        return "root"
    return snake_case.lower().strip("_")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process OpenSearch API specification.")
    parser.add_argument(
        "-s", "--selected-paths",
        nargs="+",
        default=None,
        help="API paths to convert proto."
    )

    parser.add_argument(
        "-b", "--branch-name",
        type=str,
        default="master",
        help="The branch name to checkout."
    )

    args = parser.parse_args()

    current_path = os.getcwd()
    git_root = get_git_root(current_path)

    merger_file = os.path.join(git_root, "tools", "src", "merger", "merge.ts")
    spec_source = os.path.join(git_root, "spec")
    proto_output_dir = os.path.join(git_root, "proto")

    with tempfile.TemporaryDirectory() as temp_dir:
        # 1, merger
        merger_output = os.path.join(temp_dir, "build", "opensearch-openapi.yaml")
        run_merger_script(merger_file, spec_source, merger_output)


        # 2, build tools
        jar_path = clone_build(REPO_URL, args.branch_name)


        selected_path = args.selected_paths or get_openapi_paths(merger_output)

        for sp in selected_path:
            # 3. preprocess openapi yaml file
            path_name = sanitize_path_name(sp)
            selected_output = os.path.join(temp_dir, "build", path_name, "filtered-opensearch-openapi.yaml")
            preprocess_openapi(merger_output, selected_output, sp)
            proto_out = os.path.join(proto_output_dir, path_name)

            # 4. run tooling command
            JAR_ARGS = [
                "generate",
                "-i", selected_output,
                "-g", "protobuf-schema",
                "-o",  proto_out,
                "--additional-properties", "numberedFieldNumberList=true,startEnumsWithUnknown=true"
            ]

            convert_proto(jar_path, JAR_ARGS)