plugins {
    java
    `java-library`
    id("com.diffplug.spotless").version("6.11.0")
}

group = "org.opensearch.smithy"

repositories {
    mavenCentral()
}

dependencies {
    implementation("software.amazon.smithy:smithy-openapi:1.26.0")
}

spotless {
    kotlinGradle {
        target("**/*.kts", "**/*.java", "**/*.smithy")

        indentWithSpaces()
        endWithNewline()
        trimTrailingWhitespace()
    }
}
