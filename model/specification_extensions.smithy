// SPDX-License-Identifier: Apache-2.0
//
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

$version: "2"
namespace OpenSearch

use smithy.openapi#specificationExtension

@trait
@specificationExtension(as: "x-data-type")
enum xDataType {
    ARRAY = "array",
    TIME = "time"
}

@trait
@specificationExtension(as: "x-enum-options")
list xEnumOptions {
    member: String
}

@trait
@specificationExtension(as: "x-deprecation-message")
string xDeprecationMessage

@trait
@specificationExtension(as: "x-version-deprecated")
string xVersionDeprecated

@trait
@specificationExtension(as: "x-operation-group")
string xOperationGroup

@trait
@specificationExtension(as: "x-version-added")
string xVersionAdded

@trait
@specificationExtension(as: "x-serialize")
enum xSerialize {
    BULK = "bulk"
}

@trait
@specificationExtension(as: "x-overloaded-param")
string xOverloadedParam

@trait
@specificationExtension(as: "x-ignorable")
boolean xIgnorable
