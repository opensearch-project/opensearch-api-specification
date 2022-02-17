namespace OpenSearch

@pattern("^[^+_\\-\\.][^\\\\, /*?\"<>| ,#\\nA-Z]+$")
string IndexName

@pattern("^([0-9]+)(?:d|h|m|s|ms|micros|nanos)$")
string Time

map UserDefinedValueMap{
    key: String,
    value: UserDefinedValue
}

document UserDefinedValue