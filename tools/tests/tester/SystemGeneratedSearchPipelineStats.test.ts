/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { read_yaml } from "helpers";

test('models system-generated search pipeline stats as keyed processor and factory maps', () => {
  const schemas = read_yaml('spec/schemas/nodes.stats.yaml').components.schemas

  expect(schemas.ShardSearchPipelineStats.properties).toMatchObject({
    system_generated_processors: {
      $ref: '#/components/schemas/ShardSearchPipelineSystemGeneratedProcessors'
    },
    system_generated_factories: {
      $ref: '#/components/schemas/ShardSearchPipelineSystemGeneratedFactories'
    }
  })

  expect(schemas.ShardSearchPipelineProcessorStatsByName).toEqual({
    type: 'object',
    propertyNames: {
      title: 'processor_name',
      type: 'string'
    },
    additionalProperties: {
      $ref: '#/components/schemas/ShardSearchPipelinePerPipelineProcessorStats'
    },
    minProperties: 1,
    maxProperties: 1
  })

  expect(schemas.ShardSearchPipelineFactoryStatsByType).toEqual({
    type: 'object',
    propertyNames: {
      title: 'factory_type',
      type: 'string'
    },
    additionalProperties: {
      $ref: '#/components/schemas/ShardSearchPipelineFactoryStats'
    },
    minProperties: 1,
    maxProperties: 1
  })

  expect(schemas.ShardSearchPipelineFactoryStats.properties).toEqual({
    type: {
      type: 'string'
    },
    evaluation_stats: {
      $ref: '#/components/schemas/ShardSearchPipelineOperationStats'
    },
    generation_stats: {
      $ref: '#/components/schemas/ShardSearchPipelineOperationStats'
    }
  })

  expect(schemas.ShardSearchPipelineOperationStats.properties.time_in_micros).toEqual({
    type: 'integer',
    format: 'int64'
  })
})
