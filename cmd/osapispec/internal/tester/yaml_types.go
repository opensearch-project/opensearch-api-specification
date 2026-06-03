package tester

import "gopkg.in/yaml.v3"

// StringOrList holds a YAML value that may be a single string or a list of strings.
type StringOrList []string

// UnmarshalYAML decodes a scalar string or a sequence of strings.
func (s *StringOrList) UnmarshalYAML(value *yaml.Node) error {
	if value.Kind == yaml.ScalarNode {
		*s = []string{value.Value}
		return nil
	}
	var list []string
	if err := value.Decode(&list); err != nil {
		return err
	}
	*s = list
	return nil
}

// IntOrList holds a YAML value that may be a single integer or a list of integers.
type IntOrList []int

// UnmarshalYAML decodes a scalar integer or a sequence of integers.
func (i *IntOrList) UnmarshalYAML(value *yaml.Node) error {
	if value.Kind == yaml.ScalarNode {
		var n int
		if err := value.Decode(&n); err != nil {
			return err
		}
		*i = []int{n}
		return nil
	}
	var list []int
	if err := value.Decode(&list); err != nil {
		return err
	}
	*i = list
	return nil
}
