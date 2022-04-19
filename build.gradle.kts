/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

plugins {
    id("software.amazon.smithy").version("0.6.0")
}

repositories {
    mavenLocal()
    mavenCentral()
}

buildscript {
    dependencies {
        classpath("software.amazon.smithy:smithy-aws-traits:1.21.0")
    }
}

dependencies {
    implementation("software.amazon.smithy:smithy-model:1.21.0")
    implementation("software.amazon.smithy:smithy-aws-traits:1.21.0")
}
