import { GunAwp } from "./entities/guns/awp";
import { GunGlock } from "./entities/guns/glock";
import { GunM249 } from "./entities/guns/m249";

export function getAncestors(model, includeSelf = false) {
    const ancestors = includeSelf ? [model] : [];
    let obj = model;
    while ((obj = obj.parent)) ancestors.push(obj);
    return ancestors;
}

export function getAncestorsDisplayPath(model, includeSelf = false) {
    return getAncestors(model, includeSelf)
        .map(({ name, entityType, uuid }) =>
            (entityType ? `[${entityType}]` : '') + (name ? `(${name})` : `(<${uuid}>)`)
        )
        .reverse()
        .join(' -> ');
}

export function getAncestorEntityModel(model, entityType) {
    let obj = model;
    while (obj) {
        if (obj.entityType === entityType) return obj;
        obj = obj.parent;
    }
    return null;
}

export function isChildOrSelfRecursive(model, parentOrSelf) {
    const set = new Set(parentOrSelf instanceof Array ? parentOrSelf : [parentOrSelf]);
    let obj = model;
    while (obj) {
        if (set.has(obj)) return true;
        obj = obj.parent;
    }
    return false;
}

export function getGunList() {
    const classes = [
        GunGlock,
        GunM249,
        GunAwp,
    ];
    return Object.fromEntries(classes.map(c => [c.name, c]));
}

export function getGunByName(name) {
    const guns = getGunList();
    return guns[name];
}
