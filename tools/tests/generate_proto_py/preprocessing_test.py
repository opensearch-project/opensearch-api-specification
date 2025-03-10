import unittest
import yaml
import os
from tools.src.generate_proto_py.preprocessing import preprocess_openapi
import tempfile

class TestPreprocessOpenAPI(unittest.TestCase):
    def setUp(self):
        self.input_file = "tools/tests/generate_proto_py/fixtures/animal.yaml"
        self.expected_output_file = "tools/tests/generate_proto_py/fixtures/expected.yaml"
        self.temp_dir = tempfile.TemporaryDirectory()

    def test_preprocess_openapi(self):
        output_file = os.path.join(self.temp_dir.name, "output.yaml")

        selected_path = "/animals"

        preprocess_openapi(self.input_file, output_file, selected_path)

        with open(output_file, "r") as f:
            actual_output = yaml.safe_load(f)

        with open(self.expected_output_file, "r") as f:
            expected_output = yaml.safe_load(f)

        self.assertEqual(actual_output, expected_output)
    def test_preprocess_openapi_invalid_path(self):
        output_file = os.path.join(self.temp_dir.name, "output.yaml")

        invalid_path = "/invalid-path"

        with self.assertRaises(KeyError) as context:
            preprocess_openapi(self.input_file, output_file, invalid_path)

        self.assertEqual(
            str(context.exception),
            f"\"The selected path '{invalid_path}' is not found in the OpenAPI spec.\""
        )

    def tearDown(self):
        self.temp_dir.cleanup()


if __name__ == "__main__":
    unittest.main()