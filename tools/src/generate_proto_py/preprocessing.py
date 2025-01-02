import yaml
import os


def collect_refs(item, used_refs, visited_refs, spec):
    if isinstance(item, dict):
        for key, value in item.items():
            if key == '$ref':
                used_refs.add(value)
                resolve_nested_ref(value, used_refs, visited_refs, spec)
            else:
                collect_refs(value, used_refs, visited_refs, spec)
    elif isinstance(item, list):
        for i in item:
            collect_refs(i, used_refs, visited_refs, spec)


def resolve_nested_ref(ref, used_refs, visited_refs, spec):
    if ref in visited_refs:
        return

    visited_refs.add(ref)

    if ref.startswith("#/components/"):
        ref_parts = ref.split('/')
        schema = ref_parts[2]
        component_name = ref_parts[3]

        if schema in spec['components'] and component_name in spec['components'][schema]:
            component = spec['components'][schema][component_name]
            collect_refs(component, used_refs, visited_refs, spec)

def rename_component(name):
    if '___' in name:
        return name.split('___')[-1]
    return name


def update_refs(item, rename_component):
    if isinstance(item, dict):
        for key, value in item.items():
            if key == '$ref' and value.startswith("#/components/"):
                ref_parts = value.split('/')
                schema = ref_parts[2]
                component_name = ref_parts[3]
                new_name = rename_component(component_name)
                item[key] = f"#/components/{schema}/{new_name}"
            else:
                update_refs(value, rename_component)
    elif isinstance(item, list):
        for i in item:
            update_refs(i, rename_component)


def preprocess_openapi(input_file, output_file, selected_path):
    with open(input_file, 'r') as f:
        spec = yaml.safe_load(f)

    if selected_path in spec['paths']:
        filtered_paths = {selected_path: spec['paths'][selected_path]}
    else:
        raise KeyError(f"The selected path '{selected_path}' is not found in the OpenAPI spec.")
    spec['paths'] = filtered_paths

    used_refs = set()
    visited_refs = set()

    for path_item in filtered_paths.values():
        for method, operation in path_item.items():
            if isinstance(operation, dict):
                collect_refs(operation, used_refs, visited_refs, spec)

    components = spec.get('components', {})
    filtered_components = {}

    for component_type, component_items in components.items():
        renamed_items = {}
        for name, details in component_items.items():
            if f"#/components/{component_type}/{name}" in used_refs:
                new_name = rename_component(name)
                renamed_items[new_name] = details
        filtered_components[component_type] = renamed_items

    spec['components'] = filtered_components

    update_refs(spec, rename_component)

    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w') as f:
        yaml.dump(spec, f, default_flow_style=False)

    print(f"Filtered spec saved to {output_file}")
