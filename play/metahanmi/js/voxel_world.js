import * as THREE from './three.module.js';

// https://threejsfundamentals.org/threejs/lessons/threejs-voxel-geometry.html
// https://dev.to/fradar/3d-minecraft-clone-in-three-js-with-voxel-terrain-generation-wip-2iih
class VoxelWorld {
    constructor(options) {
        this.cellSize = options.cellSize;
        this.tileSize = options.tileSize;
        this.tileTextureWidth = options.tileTextureWidth;
        this.tileTextureHeight = options.tileTextureHeight;
        const {cellSize} = this;
        this.cellSliceSize = cellSize * cellSize;
        this.cells = {};
    }
    computeVoxelOffset(x, y, z) {
        const {cellSize, cellSliceSize} = this;
        const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize) | 0;
        const voxelY = THREE.MathUtils.euclideanModulo(y, cellSize) | 0;
        const voxelZ = THREE.MathUtils.euclideanModulo(z, cellSize) | 0;
        return voxelY * cellSliceSize +
        voxelZ * cellSize +
        voxelX;
    }
    computeCellId(x, y, z) {
        const {cellSize} = this;
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
        const cellZ = Math.floor(z / cellSize);
        return `${cellX},${cellY},${cellZ}`;
    }
    addCellForVoxel(x, y, z) {
        const cellId = this.computeCellId(x, y, z);
        let cell = this.cells[cellId];
        if (!cell) {
            const {cellSize} = this;
            cell = new Uint16Array(cellSize * cellSize * cellSize);
            this.cells[cellId] = cell;
        }
        return cell;
    }
    getCellForVoxel(x, y, z) {
        return this.cells[this.computeCellId(x, y, z)];
    }
    setVoxel(x, y, z, v, addCell = true) {
        let cell = this.getCellForVoxel(x, y, z);
        if (!cell) {
            if (!addCell) {
                return;
            }
            cell = this.addCellForVoxel(x, y, z);
        }
        const voxelOffset = this.computeVoxelOffset(x, y, z);
        cell[voxelOffset] = v;
    }
    getVoxel(x, y, z) {
        const cell = this.getCellForVoxel(x, y, z);
        if (!cell) {
            return 0;
        }
        const voxelOffset = this.computeVoxelOffset(x, y, z);
        return cell[voxelOffset];
    }
    generateGeometryDataForCell(cellX, cellY, cellZ) {
        const {cellSize, tileSize, tileTextureWidth, tileTextureHeight} = this;
        const positions = [];
        const normals = [];
        const colors = [];
        const uvs = [];
        const indices = [];
        const startX = cellX * cellSize;
        const startY = cellY * cellSize;
        const startZ = cellZ * cellSize;

        let sign = [-0.5, 0.5];
        
        for (let y = 0; y < cellSize; ++y) {
            const voxelY = startY + y;
            for (let z = 0; z < cellSize; ++z) {
                const voxelZ = startZ + z;
                for (let x = 0; x < cellSize; ++x) {
                    const voxelX = startX + x;
                    const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
                    if (voxel) {
                        // voxel 0 is sky (empty) so for UVs we start at 0
                        const uvVoxel = voxel - 1;
                        // There is a voxel here but do we need faces for it?
                        for (const {dir, corners, uvRow} of VoxelWorld.faces) {
                            const neighbor = this.getVoxel(
                            voxelX + dir[0],
                            voxelY + dir[1],
                            voxelZ + dir[2]);
                            if (!neighbor) {
                                // this voxel has no neighbor in this direction so we need a face.
                                const ndx = positions.length / 3;
                                
                                let cnt = 0;
                                let _ao = [0, 0, 0, 0];

                                for (const {pos, uv} of corners) {
                                    positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                                    normals.push(...dir);

                                    let ao = 1;

                                    
                                    if(dir[0] === 1 || dir[0] === -1) { // right & left
                                        let side1, side2, corner;
                                        corner = this.getVoxel(pos[0] + voxelX + dir[0] * 0.5, pos[1] + voxelY + sign[pos[1]], pos[2] + voxelZ + sign[pos[2]]) > 0 ? 1 : 0;
                                        if(pos[1] === pos[2]) {
                                            side1 = this.getVoxel(pos[0] + voxelX + dir[0] * 0.5, pos[1] + voxelY + sign[0], pos[2] + voxelZ + sign[1]) > 0 ? 1 : 0;
                                            side2 = this.getVoxel(pos[0] + voxelX + dir[0] * 0.5, pos[1] + voxelY + sign[1], pos[2] + voxelZ + sign[0]) > 0 ? 1 : 0;
                                        }
                                        else {
                                            side1 = this.getVoxel(pos[0] + voxelX + dir[0] * 0.5, pos[1] + voxelY + sign[0], pos[2] + voxelZ + sign[0]) > 0 ? 1 : 0;
                                            side2 = this.getVoxel(pos[0] + voxelX + dir[0] * 0.5, pos[1] + voxelY + sign[1], pos[2] + voxelZ + sign[1]) > 0 ? 1 : 0;
                                        }
                                        if(side1 && side2) {
                                            _ao[cnt] = 0;   
                                        }
                                        else {
                                            _ao[cnt] = 3 - (side1 + side2 + corner);
                                        }
                                        ao = 0.5 + (_ao[cnt] / 3) * 0.5;
                                    }

                                    if(dir[1] === 1 || dir[1] === -1) { // top & bottom
                                        let side1, side2, corner;
                                        corner = this.getVoxel(pos[0] + voxelX + sign[pos[0]], pos[1] + voxelY + dir[1] * 0.5, pos[2] + voxelZ + sign[pos[2]]) > 0 ? 1 : 0;
                                        if(pos[0] === pos[2]) {
                                            side1 = this.getVoxel(pos[0] + voxelX + sign[0], pos[1] + voxelY + dir[1] * 0.5, pos[2] + voxelZ + sign[1]) > 0 ? 1 : 0;
                                            side2 = this.getVoxel(pos[0] + voxelX + sign[1], pos[1] + voxelY + dir[1] * 0.5, pos[2] + voxelZ + sign[0]) > 0 ? 1 : 0;
                                        }
                                        else {
                                            side1 = this.getVoxel(pos[0] + voxelX + sign[0], pos[1] + voxelY + dir[1] * 0.5, pos[2] + voxelZ + sign[0]) > 0 ? 1 : 0;
                                            side2 = this.getVoxel(pos[0] + voxelX + sign[1], pos[1] + voxelY + dir[1] * 0.5, pos[2] + voxelZ + sign[1]) > 0 ? 1 : 0;
                                        }
                                        if(side1 && side2) {
                                            _ao[cnt] = 0;   
                                        }
                                        else {
                                            _ao[cnt] = 3 - (side1 + side2 + corner);
                                        }
                                        ao = 0.5 + (_ao[cnt] / 3) * 0.5;
                                    }

                                    if(dir[2] === 1 || dir[2] === -1) { // front & back
                                        let side1, side2, corner;
                                        corner = this.getVoxel(pos[0] + voxelX + sign[pos[0]], pos[1] + voxelY + sign[pos[1]], pos[2] + voxelZ + dir[2] * 0.5) > 0 ? 1 : 0;
                                        if(pos[0] === pos[1]) {
                                            side1 = this.getVoxel(pos[0] + voxelX + sign[0], pos[1] + voxelY + sign[1], pos[2] + voxelZ + dir[2] * 0.5) > 0 ? 1 : 0;
                                            side2 = this.getVoxel(pos[0] + voxelX + sign[1], pos[1] + voxelY + sign[0], pos[2] + voxelZ + dir[2] * 0.5) > 0 ? 1 : 0;
                                        }
                                        else {
                                            side1 = this.getVoxel(pos[0] + voxelX + sign[0], pos[1] + voxelY + sign[0], pos[2] + voxelZ + dir[2] * 0.5) > 0 ? 1 : 0;
                                            side2 = this.getVoxel(pos[0] + voxelX + sign[1], pos[1] + voxelY + sign[1], pos[2] + voxelZ + dir[2] * 0.5) > 0 ? 1 : 0;
                                        }
                                        if(side1 && side2) {
                                            _ao[cnt] = 0;   
                                        }
                                        else {
                                            _ao[cnt] = 3 - (side1 + side2 + corner);
                                        }
                                        ao = 0.5 + (_ao[cnt] / 3) * 0.5;
                                    }
                                    
                                    let r = 1;
                                    let g = 1;
                                    let b = 1;
                                    if(window.palette && voxel >= 100) {
                                        const hex = window.palette[ voxel - 100 ];
                                        r = ( hex >> 0 & 0xff ) / 0xff;
                                        g = ( hex >> 8 & 0xff ) / 0xff;
                                        b = ( hex >> 16 & 0xff ) / 0xff;
                                    }
                                    
                                    colors.push(
                                        r * ao,
                                        g * ao,
                                        b * ao
                                    );
                                    
                                    cnt++;

                                    if(voxel < 100) {
                                        uvs.push(
                                        (uvVoxel +   uv[0]) * tileSize / tileTextureWidth,
                                        1 - (uvRow + 1 - uv[1]) * tileSize / tileTextureHeight);
                                    }
                                    else {
                                        uvs.push(0, 0);
                                    }
                                    
                                }
                                
                                //console.log(_ao);
                                if(_ao[0] + _ao[3] < _ao[1] + _ao[2]) {
                                    indices.push(
                                    ndx, ndx + 1, ndx + 2,
                                    ndx + 2, ndx + 1, ndx + 3,
                                    );
                                }
                                else { // flipped
                                    indices.push(
                                    ndx, ndx + 1, ndx + 3,
                                    ndx + 2, ndx, ndx + 3,
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return {
            positions,
            normals,
            colors,
            uvs,
            indices,
        };
    }

    // from
    // http://www.cse.chalmers.se/edu/year/2010/course/TDA361/grid.pdf
    intersectRay(start, end) {
        let dx = end.x - start.x;
        let dy = end.y - start.y;
        let dz = end.z - start.z;
        const lenSq = dx * dx + dy * dy + dz * dz;
        const len = Math.sqrt(lenSq);
        
        dx /= len;
        dy /= len;
        dz /= len;
        
        let t = 0.0;
        let ix = Math.floor(start.x);
        let iy = Math.floor(start.y);
        let iz = Math.floor(start.z);
        
        const stepX = (dx > 0) ? 1 : -1;
        const stepY = (dy > 0) ? 1 : -1;
        const stepZ = (dz > 0) ? 1 : -1;
        
        const txDelta = Math.abs(1 / dx);
        const tyDelta = Math.abs(1 / dy);
        const tzDelta = Math.abs(1 / dz);
        
        const xDist = (stepX > 0) ? (ix + 1 - start.x) : (start.x - ix);
        const yDist = (stepY > 0) ? (iy + 1 - start.y) : (start.y - iy);
        const zDist = (stepZ > 0) ? (iz + 1 - start.z) : (start.z - iz);
        
        // location of nearest voxel boundary, in units of t
        let txMax = (txDelta < Infinity) ? txDelta * xDist : Infinity;
        let tyMax = (tyDelta < Infinity) ? tyDelta * yDist : Infinity;
        let tzMax = (tzDelta < Infinity) ? tzDelta * zDist : Infinity;
        
        let steppedIndex = -1;
        
        // main loop along raycast vector
        while (t <= len) {
            const voxel = this.getVoxel(ix, iy, iz);
            if (voxel) {
                return {
                    position: [
                        start.x + t * dx,
                        start.y + t * dy,
                        start.z + t * dz,
                    ],
                    normal: [
                        steppedIndex === 0 ? -stepX : 0,
                        steppedIndex === 1 ? -stepY : 0,
                        steppedIndex === 2 ? -stepZ : 0,
                    ],
                    voxel,
                };
            }
            
            // advance t to next nearest voxel boundary
            if (txMax < tyMax) {
                if (txMax < tzMax) {
                    ix += stepX;
                    t = txMax;
                    txMax += txDelta;
                    steppedIndex = 0;
                } else {
                    iz += stepZ;
                    t = tzMax;
                    tzMax += tzDelta;
                    steppedIndex = 2;
                }
            } else {
                if (tyMax < tzMax) {
                    iy += stepY;
                    t = tyMax;
                    tyMax += tyDelta;
                    steppedIndex = 1;
                } else {
                    iz += stepZ;
                    t = tzMax;
                    tzMax += tzDelta;
                    steppedIndex = 2;
                }
            }
        }
        return null;
    }
}

VoxelWorld.faces = [
    { // left
        uvRow: 0,
        dir: [ -1,  0,  0, ],
        corners: [
        { pos: [ 0, 1, 0 ], uv: [ 0, 1 ], },
        { pos: [ 0, 0, 0 ], uv: [ 0, 0 ], },
        { pos: [ 0, 1, 1 ], uv: [ 1, 1 ], },
        { pos: [ 0, 0, 1 ], uv: [ 1, 0 ], },
        ],
    },
    { // right
        uvRow: 0,
        dir: [  1,  0,  0, ],
        corners: [
        { pos: [ 1, 1, 1 ], uv: [ 0, 1 ], },
        { pos: [ 1, 0, 1 ], uv: [ 0, 0 ], },
        { pos: [ 1, 1, 0 ], uv: [ 1, 1 ], },
        { pos: [ 1, 0, 0 ], uv: [ 1, 0 ], },
        ],
    },
    { // bottom
        uvRow: 1,
        dir: [  0, -1,  0, ],
        corners: [
        { pos: [ 1, 0, 1 ], uv: [ 1, 0 ], },
        { pos: [ 0, 0, 1 ], uv: [ 0, 0 ], },
        { pos: [ 1, 0, 0 ], uv: [ 1, 1 ], },
        { pos: [ 0, 0, 0 ], uv: [ 0, 1 ], },
        ],
    },
    { // top
        uvRow: 2,
        dir: [  0,  1,  0, ],
        corners: [
        { pos: [ 0, 1, 1 ], uv: [ 1, 1 ], },
        { pos: [ 1, 1, 1 ], uv: [ 0, 1 ], },
        { pos: [ 0, 1, 0 ], uv: [ 1, 0 ], },
        { pos: [ 1, 1, 0 ], uv: [ 0, 0 ], },
        ],
    },
    { // back
        uvRow: 0,
        dir: [  0,  0, -1, ],
        corners: [
        { pos: [ 1, 0, 0 ], uv: [ 0, 0 ], },
        { pos: [ 0, 0, 0 ], uv: [ 1, 0 ], },
        { pos: [ 1, 1, 0 ], uv: [ 0, 1 ], },
        { pos: [ 0, 1, 0 ], uv: [ 1, 1 ], },
        ],
    },
    { // front
        uvRow: 0,
        dir: [  0,  0,  1, ],
        corners: [
        { pos: [ 0, 0, 1 ], uv: [ 0, 0 ], },
        { pos: [ 1, 0, 1 ], uv: [ 1, 0 ], },
        { pos: [ 0, 1, 1 ], uv: [ 0, 1 ], },
        { pos: [ 1, 1, 1 ], uv: [ 1, 1 ], },
        ],
    },
];

export { VoxelWorld };