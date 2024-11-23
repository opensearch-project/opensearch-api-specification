#
# Copyright OpenSearch Contributors
# SPDX-License-Identifier: Apache-2.0
#
# The OpenSearch Contributors require contributions made to
# this file be licensed under the Apache-2.0 license or a
# compatible open source license.
#

from http.server import BaseHTTPRequestHandler, HTTPServer


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application_json")
        self.end_headers()
        self.wfile.write(b'{"ok":"true"}')

    def do_POST(self):
        self.send_response(200)
        self.send_header("Content-type", "application_json")
        self.end_headers()
        self.wfile.write(b'{"ok":"true"}')


if __name__ == "__main__":
    server_address = ("", 8080)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    print("Server started on http://localhost:8080")
    httpd.serve_forever()
