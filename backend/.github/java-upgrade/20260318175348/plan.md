# Upgrade Plan: backend (20260318175348)

- **Generated**: 2026-03-18 17:53:48
- **HEAD Branch**: N/A
- **HEAD Commit ID**: N/A

**⚠️ Git Notice**: This project is not version-controlled with git. Changes will not be automatically committed during this upgrade. All modifications will remain in the working directory until manually committed.

## Available Tools

**JDKs**
- JDK 21.0.1: C:\Program Files\Java\jdk-21\bin (✅ Available, target version)

**Build Tools**
- Maven Wrapper: 3.9.12 (✅ Available and compatible with Java 21)

## Guidelines

- Upgrade Java runtime to LTS version Java 21
- Maintain Spring Boot 3.2.5 compatibility
- Ensure all tests pass post-upgrade
- No breaking changes should be introduced

## Options

- Working branch: appmod/java-upgrade-20260318175348
- Run tests before and after the upgrade: true

## Upgrade Goals

- Upgrade Java from 17 to 21 (LTS)
- Maintain Spring Boot 3.2.5 and all current dependencies at compatible versions

### Technology Stack

| Technology/Dependency | Current | Min Compatible | Why Incompatible |
| --------------------- | ------- | -------------- | ---------------- |
| Java | 17 | 21 | User-requested upgrade |
| Spring Boot | 3.2.5 | 3.2.5 | Already compatible with Java 21 |
| Maven (wrapper) | 3.9.12 | 3.9.0 | Compatible with Java 21 |
| Spring Framework | 6.1.x (inherited) | 6.1.x | Already compatible with Java 21 |
| Spring Security | 6.1.x (inherited) | 6.1.x | Already compatible with Java 21 |
| Lombok | 1.18.x (inherited) | 1.18.x | Compatible with Java 21 |
| jjwt | 0.11.5 | 0.11.5 | Compatible with Java 21 |
| Spring Data MongoDB | 4.1.x (inherited) | 4.1.x | Compatible with Java 21 |

### Derived Upgrades

**No additional dependency upgrades required.**

Analysis:
- Spring Boot 3.2.5 is already compatible with Java 21
- Maven Wrapper 3.9.12 already supports Java 21
- All transitive dependencies are compatible with Java 21 (inherited from Spring Boot parent BOM)
- No jakarta.* migration needed (already done in Spring Boot 3.x)

Only required change: Update `<java.version>17</java.version>` to `<java.version>21</java.version>` in pom.xml

## Upgrade Steps

### Step 1: Setup Environment

**Rationale**: Verify JDK 21 is available and ready. No installation needed as JDK 21.0.1 is already installed.

**Changes to Make**:
- [ ] Verify JDK 21.0.1 is accessible at C:\Program Files\Java\jdk-21
- [ ] Verify Maven Wrapper (mvnw.cmd) is executable
- [ ] No new installations required

**Verification**:
- Command: `java -version && mvnw -v`
- JDK: 21.0.1
- Expected: Both commands succeed; Java 21.0.1 and Maven 3.9.12 confirmed

---

### Step 2: Setup Baseline

**Rationale**: Establish pre-upgrade compilation and test baseline with Java 17 to measure success against.

**Changes to Make**:
- [ ] No code changes; measurement only
- [ ] Document compilation result (Java 17)
- [ ] Document test results with Java 17 (baseline pass rate)

**Verification**:
- Command: `mvnw clean test-compile -q && mvnw clean test -q`
- JDK: Current (Java 17)
- Expected: Compilation SUCCESS, document test pass rate

---

### Step 3: Upgrade java.version to 21

**Rationale**: Update the target Java version in pom.xml from 17 to 21.

**Changes to Make**:
- [ ] Update `<java.version>17</java.version>` → `<java.version>21</java.version>` in pom.xml
- [ ] Verify pom.xml changes
- [ ] Clean rebuild to verify compilation

**Verification**:
- Command: `mvnw clean test-compile -q`
- JDK: Java 21.0.1
- Expected: Compilation SUCCESS (both main and test code)

---

### Step 4: Final Validation

**Rationale**: Run full test suite with Java 21 to verify all upgrade goals are met and achieve 100% test pass rate.

**Changes to Make**:
- [ ] Verify `<java.version>21</java.version>` is set in pom.xml
- [ ] Resolve any test failures through iterative fix loop
- [ ] Ensure all tests pass

**Verification**:
- Command: `mvnw clean test -q` (full test suite)
- JDK: Java 21.0.1
- Expected: Compilation SUCCESS + 100% test pass rate

## Key Challenges

**None identified.** This is a straightforward Java LTS upgrade:
- Spring Boot 3.2.5 is modern and already compatible with Java 21
- No breaking API changes expected
- No dependency replacements or migrations required
- No build tool upgrades needed (Maven Wrapper 3.9.12 is compatible)
- Jakarta EE migration already completed in Spring Boot 3.x

## Plan Review Status

✅ **Plan Review Complete**

Verification Checklist:
- ✅ All sections populated
- ✅ Available Tools identified (JDK 21 present, Maven Wrapper compatible)
- ✅ Technology Stack analyzed (Spring Boot 3.2.5 is Java 21 compatible)
- ✅ Upgrade steps are clear and logical
- ✅ No missing dependencies or compatibility issues identified
- ✅ Feasible upgrade path (direct upgrade; no intermediates needed)
- ✅ No unfixable limitations identified

**Conclusion**: Plan is ready for execution. Java 21 upgrade is straightforward as Spring Boot 3.2.5 already supports it.
