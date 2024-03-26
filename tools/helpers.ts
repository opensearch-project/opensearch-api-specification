export function resolve(ref: string, root: Record<string, any>) {
    const paths = ref.replace('#/', '').split('/');
    for(const p of paths) {
        root = root[p];
        if(root === undefined) break;
    }
    return root;
}