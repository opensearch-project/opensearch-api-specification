package tester

import (
	"fmt"
	"regexp"
	"strings"

	"golang.org/x/mod/semver"
)

// shouldSkip determines if a chapter/story should be skipped based on version and distribution constraints.
//
//nolint:nestif // sequential constraint checks are clear as-is
func shouldSkip(versionConstraint string, dist *Distributions, clusterVersion, clusterDist string) (bool, string) {
	if versionConstraint != "" && clusterVersion != "" {
		if !matchesVersion(versionConstraint, clusterVersion) {
			return true, fmt.Sprintf("version constraint %q not met (cluster: %s)", versionConstraint, clusterVersion)
		}
	}

	if dist != nil && clusterDist != "" {
		if len(dist.Excluded) > 0 {
			for _, d := range dist.Excluded {
				if strings.EqualFold(d, clusterDist) {
					return true, fmt.Sprintf("distribution %q excluded", clusterDist)
				}
			}
		}
		if len(dist.Included) > 0 {
			found := false
			for _, d := range dist.Included {
				if strings.EqualFold(d, clusterDist) {
					found = true
					break
				}
			}
			if !found {
				return true, fmt.Sprintf("distribution %q not in included list", clusterDist)
			}
		}
	}

	return false, ""
}

var constraintRE = regexp.MustCompile(`(>=|<=|>|<|=)\s*([0-9]+(?:\.[0-9]+){0,2})`)

// matchesVersion checks if clusterVersion satisfies a version constraint string.
// Supports constraints like ">= 2.4", "< 3.0", ">= 2.0, < 3.0", ">= 2.4 < 2.19".
func matchesVersion(constraint, version string) bool {
	ver := coerceToSemver(version)
	if !semver.IsValid(ver) {
		return true
	}

	matches := constraintRE.FindAllStringSubmatch(constraint, -1)
	if len(matches) == 0 {
		return true
	}

	for _, m := range matches {
		op := m[1]
		target := coerceToSemver(m[2])
		if !semver.IsValid(target) {
			continue
		}
		cmp := semver.Compare(ver, target)
		switch op {
		case ">=":
			if cmp < 0 {
				return false
			}
		case ">":
			if cmp <= 0 {
				return false
			}
		case "<=":
			if cmp > 0 {
				return false
			}
		case "<":
			if cmp >= 0 {
				return false
			}
		case "=":
			if cmp != 0 {
				return false
			}
		}
	}
	return true
}

// coerceToSemver normalizes a version string to the "vMAJOR.MINOR.PATCH" form required by x/mod/semver.
func coerceToSemver(s string) string {
	s = strings.TrimSpace(s)
	if idx := strings.IndexByte(s, '-'); idx >= 0 {
		s = s[:idx]
	}
	parts := strings.Split(s, ".")
	switch len(parts) {
	case 1:
		s = parts[0] + ".0.0"
	case 2:
		s += ".0"
	}
	if !strings.HasPrefix(s, "v") {
		s = "v" + s
	}
	return s
}
