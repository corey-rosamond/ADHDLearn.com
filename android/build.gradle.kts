plugins {
    id("com.android.application")
    kotlin("android")
}

val natives: Configuration by configurations.creating

dependencies {
    implementation(project(":core"))
    implementation(project(":games:bubble-pop"))

    api("com.badlogicgames.gdx:gdx-backend-android:${project.property("gdxVersion")}")
    natives("com.badlogicgames.gdx:gdx-platform:${project.property("gdxVersion")}:natives-arm64-v8a")
    natives("com.badlogicgames.gdx:gdx-platform:${project.property("gdxVersion")}:natives-armeabi-v7a")
    natives("com.badlogicgames.gdx:gdx-platform:${project.property("gdxVersion")}:natives-x86")
    natives("com.badlogicgames.gdx:gdx-platform:${project.property("gdxVersion")}:natives-x86_64")

    api("com.badlogicgames.gdx:gdx-box2d:${project.property("gdxVersion")}")
    natives("com.badlogicgames.gdx:gdx-box2d-platform:${project.property("gdxVersion")}:natives-arm64-v8a")
    natives("com.badlogicgames.gdx:gdx-box2d-platform:${project.property("gdxVersion")}:natives-armeabi-v7a")
    natives("com.badlogicgames.gdx:gdx-box2d-platform:${project.property("gdxVersion")}:natives-x86")
    natives("com.badlogicgames.gdx:gdx-box2d-platform:${project.property("gdxVersion")}:natives-x86_64")

    api("com.badlogicgames.gdx:gdx-freetype:${project.property("gdxVersion")}")
    natives("com.badlogicgames.gdx:gdx-freetype-platform:${project.property("gdxVersion")}:natives-arm64-v8a")
    natives("com.badlogicgames.gdx:gdx-freetype-platform:${project.property("gdxVersion")}:natives-armeabi-v7a")
    natives("com.badlogicgames.gdx:gdx-freetype-platform:${project.property("gdxVersion")}:natives-x86")
    natives("com.badlogicgames.gdx:gdx-freetype-platform:${project.property("gdxVersion")}:natives-x86_64")
}

android {
    namespace = "com.aurora.reading"
    compileSdk = 33

    sourceSets {
        named("main") {
            manifest.srcFile("src/main/AndroidManifest.xml")
            java.srcDirs("src/main/kotlin")
            aidl.srcDirs("src/main/kotlin")
            renderscript.srcDirs("src/main/kotlin")
            res.srcDirs("src/main/res")
            assets.srcDirs("../assets")
            jniLibs.srcDirs("libs")
        }
    }

    packagingOptions {
        resources {
            excludes += "META-INF/robovm/ios/robovm.xml"
        }
    }

    defaultConfig {
        applicationId = "com.aurora.reading"
        minSdk = 24
        targetSdk = 33
        versionCode = 1
        versionName = "1.0.0"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildTypes {
        named("release") {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}

// Copy native libraries
tasks.register("copyAndroidNatives") {
    doFirst {
        natives.forEach { jar ->
            val outputDir = file("libs/" + jar.nameWithoutExtension.substringAfterLast("natives-"))
            outputDir.mkdirs()
            copy {
                from(zipTree(jar))
                into(outputDir)
                include("*.so")
            }
        }
    }
}

tasks.whenTaskAdded {
    if (name.contains("package")) {
        dependsOn("copyAndroidNatives")
    }
}
