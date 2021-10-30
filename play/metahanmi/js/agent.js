import * as vec3 from './gl-vec3.js';
import { AABB } from './aabb-3d.js';

class Agent {
    constructor(mesh, agents, world, phys, player) {
        
        this.mesh = mesh;
        this.agents = agents;
        this.world = world;
        this.phys = phys;
        this.player = player;

        let bbox = mesh.geometry.boundingBox;
        let wx = bbox.max.x - bbox.min.x;
        let wy = bbox.max.y - bbox.min.y;
        let wz = bbox.max.z - bbox.min.z;

        let w_xz = Math.max(Math.max(wx, wz));
        let max_w = Math.max(w_xz, wy);
        let scale = 1.0 / max_w;
        mesh.scale.set(scale, scale, scale);

        let aabb = new AABB(
            [0, 0, 0],
            [w_xz * scale + 0.1, wy * scale + 0.1, w_xz * scale + 0.1]
        );

        this.body = phys.addBody(aabb, 1, 0.25, 0, 2, null);
        //this.body.autoStep = true;
        this.aabb = this.body.aabb;

        this.bcont = [];
        for(let bone of mesh.skeleton.bones) {
            if(bone.type === 'Bone') {
                if(bone.parent.type === 'Bone') {
                    let bc = {
                        phase: Math.random() * Math.PI * 2,
                        amp: (0.01 + 0.09 * Math.random()) * Math.PI,
                        speed: (0.1 + 0.9 * Math.random()) * 5,
                        axis: Math.random() > 0.5 ? 'z' : 'x',
                        bone: bone,
                    }; 
                    this.bcont.push(bc);   
                }    
            }
        }

        this.signs = [-1, 0, 1];
        this.until_act = 30;
        this.until_free = 30;
        this.until_turn = 30;
        this.until_move = 30;
        this.until_jump = 30;

        this.avoid_range = (5 + Math.random() * 5) | 0;

        this.is_moving = true;

        this.to_rot = 0;
        this.v_rot = 0;
        this.rot = 0;
        this.tx = 0;
        this.tz = 0;

        this.steps = 0;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = 0.9 + Math.random() * 0.2;
        this.jumpy = 0;
        this.to_jumpy = 0;
    }

    // 무한루프? 직접 aabb 좌표를 수정하면 무한루프에 빠질 수 있음. using rigid body setPosition
    setPosition(x, y, z) {
        this.body.setPosition([
            x - this.body.aabb.vec[0]*0.5,
            y - this.body.aabb.vec[1]*0.5,
            z - this.body.aabb.vec[2]*0.5
        ]);
    }

    getPosition() {
        return [
            this.body.aabb.base[0] + this.body.aabb.vec[0]*0.5,
            this.body.aabb.base[1] + this.body.aabb.vec[1]*0.5,
            this.body.aabb.base[2] + this.body.aabb.vec[2]*0.5
        ];
    }

    turn(theta) {
        if(Math.abs(theta - this.rot) > Math.PI) {
            theta = Math.PI * 2 - theta;
        }
        this.to_rot = theta;
    }

    with_others(pos) {
        for(let i = 0; i < this.agents.length; i++) {
            let agent = this.agents[i];
            if(this !== agent) {
                let p = agent.getPosition();
                let dx = p[0] - pos[0];
                let dy = p[1] - pos[1];
                let dz = p[2] - pos[2];
                if(Math.abs(dy) < 1.5) {
                    let d = Math.hypot(dx, dz);
                    if(d < 1) {
                        this.body.applyForce([-dx*10, 0, -dz*10]);
                        agent.body.applyForce([dx*10, 0, dz*10]);
                    }
                }
            }
        }
    }

    update(time) {
        this.v_rot += (this.to_rot - this.rot) * 0.1;
        this.rot += this.v_rot * 0.1;
        this.jumpy += (this.to_jumpy - this.jumpy) * 0.1;
        this.v_rot *= 0.9;
        let qx = Math.cos(this.rot);
        let qz = Math.sin(this.rot);
        this.mesh.rotation.set(0, Math.atan2(qz, qx), 0);

        //this.mesh.rotation.set(0, this.rot, 0);

        let pos = this.getPosition();
        let p_pos = this.player.getPosition();

        this.with_others(pos);

        let dx = p_pos[0] - pos[0];
        let dy = p_pos[1] - pos[1];
        let dz = p_pos[2] - pos[2];
        let player_distance = Math.hypot(dx, dy, dz);
        if(this.until_free > 0) {
            this.until_free -= 1;
        }
        if(player_distance < 1) {
            this.body.applyImpulse([-dx*0.1, 0, -dz*0.1]);
        }
        if(player_distance <= 2) {
            this.turn(Math.atan2(dx, dz));
            this.until_free = 60;

            if(!window.doing_quiz && window.until_quiz === 0) {
                window.doing_quiz = true;
                window.curr_agent = this;
                window.do_quiz();
            }
        }
        //this.mesh.rotation.set(0, -Math.PI * 0.25, 0);
        
        if(this.until_free === 0 && !window.doing_quiz) {
            if(this.until_jump > 0) {
                this.until_jump -= 1;
            }
            if(this.until_jump === 0) {
                if(Math.random() > 0.1) {
                    let theta = Math.atan2(this.tz, this.tx);
                    let tx = Math.sin(theta) * 0.5;
                    let tz = Math.cos(theta) * 0.5;
                    this.body.applyImpulse([tx, 8, tz]);
                }
                this.until_jump = 90 + Math.random() * 120 | 0;
            }

            if(Math.abs(dy) < 5) {
                if(player_distance > 2 && player_distance < this.avoid_range) {
                    if(Math.random() > 0.5) {
                        let d_theta = Math.sin(this.steps * 0.02 * this.speed + this.phase) * Math.PI * 0.4;
                        let theta = Math.atan2(dx, dz) + d_theta;
                        this.turn(theta);
                        this.tx += (this.tx - Math.sin(theta)) * 0.1;
                        this.tz += (this.tz - Math.cos(theta)) * 0.1;    
                    }
                    //this.until_jump = 2;
                    this.until_turn = 30;
                    this.is_moving = true;
                }
            }

            if(this.until_turn > 0) {
                this.until_turn -= 1;
            }
            if(this.until_turn === 0) {
                //let theta = Math.random() * Math.PI * 2;
                let theta = (Math.random() * 8 | 0) * Math.PI * 0.25;
                this.turn(theta);
                this.tz = Math.cos(this.to_rot);
                this.tx = Math.sin(this.to_rot);
                this.until_turn = 60 + Math.random() * 120 | 0;
            }
    
            if(this.until_move > 0) {
                this.until_move -= 1;
            }
            if(this.until_move === 0) {
                this.is_moving = Math.random() > 0.2 ? true : false;
                this.until_move = 60 + Math.random() * 60 | 0;
            }
            if(this.is_moving) {
                this.steps += 1;
                this.body.applyForce([this.tx*15, 0, this.tz*15]);
                let d = Math.hypot(this.tx, this.tz);
                if(d > 0.2) {
                    this.tx *= 0.9;
                    this.tz *= 0.9;
                }
                this.to_jumpy = Math.abs(Math.sin(this.steps * 0.05 * this.speed + this.phase)) * 0.15;
            }
        }
        

        this.mesh.position.set(
            this.aabb.base[0] + this.aabb.vec[0]*0.5,
            this.aabb.base[1] + this.aabb.vec[1]*0.5 + this.jumpy,
            this.aabb.base[2] + this.aabb.vec[2]*0.5
        );

        for(let bc of this.bcont) {
            bc.bone.rotation[bc.axis] = bc.amp * Math.sin(time * bc.speed + bc.phase); 
        }
    }
}

export { Agent };