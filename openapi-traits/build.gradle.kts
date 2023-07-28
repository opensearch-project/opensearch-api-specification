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
    implementation("software.amazon.smithy:smithy-openapi:1.35.0")
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
}

spotless {
    kotlinGradle {
        target("**/*.kts", "**/*.java", "**/*.smithy")

        indentWithSpaces()
        endWithNewline()
        trimTrailingWhitespace()
    }
}
