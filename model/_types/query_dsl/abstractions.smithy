// SPDX-License-Identifier: Apache-2.0
// 
//  The OpenSearch Contributors require contributions made to
//  this file be licensed under the Apache-2.0 license or a
//  compatible open source license.

namespace OpenSearch

structure UserDefinedObjectStructure {
    bool: Document,
    boosting: Document,
    combined_fields: Document,
    constant_score: Document,
    dis_max: Document,
    distance_feature: Document,     
    exists: Document,
    function_score: Document,
    fuzzy: UserDefinedValueMap,
    geo_bounding_box: Document,
    geo_distance: Document,
    geo_polygon: Document,
    geo_shape: Document,
    has_child: Document,
    has_parent: Document,
    ids: Document,
    intervals: UserDefinedValueMap,
    knn: Document,
    match: UserDefinedValueMap,
    match_all: Document,                           
    match_bool_prefix: UserDefinedValueMap,
    match_none: Document,                           
    match_phrase: UserDefinedValueMap,
    match_phrase_prefix: UserDefinedValueMap,
    more_like_this: Document,
    multi_match: Document,
    nested: Document,
    parent_id: Document,
    percolate: Document,
    pinned: Document,
    prefix:UserDefinedValueMap,
    query_string: Document,
    range: UserDefinedValueMap,
    rank_feature: Document,
    regexp: UserDefinedValueMap,
    script: Document,
    script_score: Document,
    shape: Document,
    simple_query_string: Document,
    span_containing: Document,
    field_masking_span: Document,
    span_first: Document,
    span_multi: Document,
    span_near: Document,
    span_not: Document,
    span_or: Document,
    span_term: UserDefinedValueMap,
    span_within: Document,
    term: UserDefinedValueMap,
    terms: Document,
    terms_set: UserDefinedValueMap,
    wildcard: UserDefinedValueMap,
    wrapper: Document,
    
}