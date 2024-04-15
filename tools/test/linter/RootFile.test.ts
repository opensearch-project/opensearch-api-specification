import RootFile from "../../linter/components/RootFile";

test('validate()', () => {
    const validator = new RootFile('./test/linter/fixtures/root.yaml');
    expect(validator.validate()).toEqual([
        {
            file: "root.yaml",
            location: "Path: /",
            message: "Every path must be a reference object to a path in a namespace file."
        },
        {
            file: "root.yaml",
            location: "Path: /{index}",
            message: "Every path must be a reference object to a path in a namespace file."
        }
    ]);
});