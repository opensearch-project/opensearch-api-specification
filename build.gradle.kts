/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

plugins {
	id("software.amazon.smithy").version("0.6.0")
	id("com.diffplug.spotless").version("6.11.0")
}

repositories {
	mavenLocal()
	mavenCentral()
}

buildscript {
	dependencies {
		classpath("software.amazon.smithy:smithy-openapi:$smithyVersion")
		classpath("software.amazon.smithy:smithy-aws-traits:$smithyVersion")
		classpath("software.amazon.smithy:smithy-cli:$smithyVersion")
	}
}

dependencies {
	implementation("software.amazon.smithy:smithy-model:$smithyVersion")
	implementation("software.amazon.smithy:smithy-linters:$smithyVersion")
	implementation("software.amazon.smithy:smithy-aws-traits:$smithyVersion")
}

spotless {
	kotlinGradle {
		target("**/*.kts", "*.md", "**/*.smithy", ".gitignore")

		indentWithTabs()
		endWithNewline()
		trimTrailingWhitespace()
	}
}
