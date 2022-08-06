import Component, { ComponentType, IComponent } from "./Component";
import { Entity } from "./Entity";
import { SystemArchetype } from "./System";


export default class ComponentManager {
    private components : Map<ComponentType, Map<Entity, IComponent>> = new Map();

    addComponent(entity : Entity, ...components : IComponent[]) {
        for(const c of components) {
            this._addComponent(entity, c);
        }
        return this;        
    }

    private _addComponent(entity : Entity, component : IComponent) {
        const type = component.getComponentType();
        const map = this.getComponentMap(type);

        map.set(entity, component);
    }

    getFromArchetype(arch : SystemArchetype) {
        const found_entities = new Map<Entity, IComponent[]>();
        for(const type of arch) {
            if(!this.components.has(type)) continue;

            for(const [ent, cmp] of (this.components.get(type) ?? [])) {
                if(!found_entities.has(ent)) found_entities.set(ent, []);
                found_entities.get(ent)?.push(cmp);
            }
        }

        return [...found_entities.values()].filter(x => x.length === arch.length);
    }

    getForEntity<T extends IComponent[] = IComponent[]>(entity : Entity, ...arch : SystemArchetype) : T {
        //@ts-ignore
        const found : T = [];

        for(const type of arch) {
            if(!this.components.get(type)?.get(entity)) throw new Error(type.toString() + " Doesnt exist on entity");
            
            //@ts-ignore
            found.push(this.components.get(type).get(entity));
        }

        return found;
    }

    private getComponentMap(type : ComponentType){
        let m = this.components.get(type);
        if(m) return m;

        m = new Map<Entity, IComponent>();
        this.components.set(type, m);
        return m;
    }
}