// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

@pattern("^[^+_\\-\\.][^\\\\, /*?\"<>| ,#\\nA-Z]+$")
string IndexName

string IdName 

@pattern("^([0-9]+)(?:d|h|m|s|ms|micros|nanos)$")
string Time

map UserDefinedValueMap{
    key: String,
    value: UserDefinedValue
}

document UserDefinedValue

@enum([
    {
     value: "transient",
     name: "transient"},
    {
     value: "persistent",
     name: "persistent"},
    {
     value: "defaults",
     name: "defaults"}
])
string SettingType

list UserDefinedValueList{
    member: String
}

list UserDefinedObjectList{
    member: Document
}

list ListHits{
    member: Hits
}
