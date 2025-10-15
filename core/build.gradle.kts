plugins {
    kotlin("jvm")
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    api("com.badlogicgames.gdx:gdx:${project.property("gdxVersion")}")
    api("com.badlogicgames.gdx:gdx-box2d:${project.property("gdxVersion")}")
    api("com.badlogicgames.gdx:gdx-freetype:${project.property("gdxVersion")}")
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
}

sourceSets {
    main {
        kotlin.srcDirs("src/main/kotlin")
        resources.srcDirs("../assets")
    }
}
