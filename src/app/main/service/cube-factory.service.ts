import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
    providedIn: 'root'
})
export class CubeFactoryService {

    constructor() { }

    generateBoxGeometry(boxGeometry: {
        width: number,
        height: number,
        depth: number,
    }, meshBasicMaterial: {
        color?: THREE.ColorRepresentation | undefined;
    },
        params: { spacing: number, unit: number, startPosition: { x: number, y: number, z: number } }): THREE.Mesh[] {

        let cubeList: THREE.Mesh[] = [];
        let unit = params.unit;
        let position = { x: params.startPosition.x, y: params.startPosition.y, z: params.startPosition.z };

        for (let i = 0; i < unit; i++) {
            const geometry = new THREE.BoxGeometry(boxGeometry.width, boxGeometry.height, boxGeometry.depth);
            const material = new THREE.MeshBasicMaterial({ color: meshBasicMaterial.color });
            const cube = new THREE.Mesh(geometry, material);

            const x = position.x + (boxGeometry.width + params.spacing) * i;
            const y = position.y;
            const z = position.z;
            cube.position.set(x, y, z);

            cubeList.push(cube);
        }

        return cubeList;
    }
}
