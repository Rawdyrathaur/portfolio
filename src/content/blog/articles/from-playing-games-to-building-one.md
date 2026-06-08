

> I grew up playing games on a low-spec PC — *Project IGI*, *Delta Force*, *GTA: San Andreas* — sitting next to my father, both of us fully absorbed in those worlds. I never thought about how they were made. I just played. Years later, I found myself inside Unity, staring at an empty scene, trying to build one of those worlds myself. This is the story of how that went.

---

## Table of Contents

- [1. The Idea — A Game Worth Building](#1-the-idea--a-game-worth-building)
- [2. Getting the Environment Right — ProBuilder](#2-getting-the-environment-right--probuilder)
- [3. Physics Almost Broke Us — Rigidbody Lessons](#3-physics-almost-broke-us--rigidbody-lessons)
- [4. The FPS Controller — Building It From Scratch](#4-the-fps-controller--building-it-from-scratch)
- [5. The Part I'm Most Proud Of — NavMesh AI](#5-the-part-im-most-proud-of--navmesh-ai)
- [6. Getting 3D Assets Into the Game — Meshy AI Pipeline](#6-getting-3d-assets-into-the-game--meshy-ai-pipeline)
- [7. Optimization and What We Learned Late](#7-optimization-and-what-we-learned-late)
- [8. Version Control — The Painful Lesson](#8-version-control--the-painful-lesson)

---

## 1. The Idea — A Game Worth Building

::video{src="https://res.cloudinary.com/dxclnybhc/video/upload/v1780927692/WhatsApp_Video_2026-05-23_at_13.36.37_1_mdwhxx.mp4" title="Game concept and first playable idea preview"}

Most beginner Unity tutorials tell you to build a ball-rolling game or a 2D platformer. We ignored that completely.

Our game had a real concept from day one: you play as a first-person soldier. There's a female character trapped in a hostile environment. Intelligent creatures — not mindless zombies, but calculated, aggressive beings — are specifically targeting her. Your job is to reach her, protect her, and get out alive. She doesn't just stand there waiting. She moves. She follows you. She survives because of you.

That idea drove every technical decision we made. We weren't building a demo. We were building something we actually wanted to play.

The team was four of us. We split the work honestly — I handled scene architecture, asset pipeline, and the AI systems. Kapil owned physics and the FPS controller. The other two covered environment layout, collision work, and testing. It wasn't always clean. We argued about design decisions constantly. That's probably why the game actually came out working.

---

## 2. Getting the Environment Right — ProBuilder

![ProBuilder environment layout preview](https://res.cloudinary.com/dxclnybhc/image/upload/v1780926497/Screenshot_2026-06-08_at_4.05.42_PM_gssf22.png)

Before writing a single script, we needed a space to move around in. Early on we tried using default Unity primitives — cubes, planes, cylinders — just to rough out the layout. It worked, barely. The problem was every time the scale felt wrong or a corridor was too narrow, we had to delete objects and start over. That gets old fast.

That's when we brought in **ProBuilder**, a geometry editing tool built right into Unity. Instead of bouncing between Unity and Blender, ProBuilder let us build and reshape the environment directly inside the scene view. Extrude a face here, shift an edge there, instantly see how it felt to move through it.

We learned something early that nobody really warns you about: **scale in games is deeply unintuitive**. Our first version of a room made the player feel like an ant. The ceiling was too high, the corridors too wide, everything felt like a warehouse. We had to sit with a controller in hand and adjust the geometry live until movement felt right — snappy, grounded, tense.

The greyboxing phase — building rough geometry to test layout before worrying about visuals — was genuinely one of the most satisfying parts of the project. You go from a blank scene to rooms you can actually walk through, stairs you can climb, sightlines that either work or force you back to ProBuilder to fix them. ProBuilder made all of that fast enough to actually iterate.

---

## 3. Physics Almost Broke Us — Rigidbody Lessons

![Blender rigid body physics reference GIF](https://i.sstatic.net/o41bV7A4.gif)


This is where we suffered the most.

When we added a **Rigidbody component** to the player, Unity handed movement over to PhysX — its internal physics simulation. That means mass, gravity, forces, collision responses — all of it calculated by the engine, not by us. In theory, great. In practice, we had no idea what we were walking into.

Our first instinct was to move the player by directly changing `transform.position`. That was the mistake.

```csharp
// What we tried first — looks fine, breaks everything
void Update() {
    transform.position += direction * speed * Time.deltaTime;
}
```

The result? The player would fall straight through the floor into infinite void. Walls would suddenly launch the character sideways across the entire map. Press into a corner and the camera would shake violently like something was fighting against itself — because it was. We were manually moving the transform at the same time PhysX was calculating physics forces. The two systems were colliding with each other every frame.

It took real research to understand what was actually happening. Unity runs on two separate loops: `Update()` runs every rendered frame, while `FixedUpdate()` runs in sync with the physics engine at a fixed timestep. The moment we moved physics objects inside `Update()`, we were breaking that sync. The fix was to stop fighting the engine:

```csharp
// Correct — moves through physics velocity, synced with PhysX
void FixedUpdate() {
    Vector3 moveVelocity = direction * targetSpeed;
    rb.velocity = new Vector3(moveVelocity.x, rb.velocity.y, moveVelocity.z);
}
```

We preserved the Y velocity so gravity still worked naturally. We let the engine handle collision responses instead of overriding them. After that — no clipping, no wall launches, no jitter. Just clean, stable movement.

That fix alone probably saved the project. It also taught me something bigger: **fighting the engine never works**. Unity is built around systems that expect to work together. When you understand how they connect, everything gets easier. When you don't, everything breaks in ways that look random but aren't.

---

## 4. The FPS Controller — Building It From Scratch

::video{src="https://res.cloudinary.com/dxclnybhc/video/upload/v1780925758/Convert_to_MP4_project_-_June_08_2026_at_18.59.12_nylls5.mp4" title="FPS controller movement preview"}


We didn't use Unity's built-in Character Controller. We built our own, partly because we wanted full control, and partly because we wanted to actually understand what we were building.

The core of a first-person controller is simpler than it sounds. You need two things: the player's body rotating on the Y-axis to look left and right, and the camera rotating on the X-axis to look up and down. Split it like that and it's manageable.

```csharp
void Update() {
    float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity * Time.deltaTime;
    float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity * Time.deltaTime;

    xRotation -= mouseY;
    xRotation = Mathf.Clamp(xRotation, -90f, 90f); // stops you looking backwards

    playerCamera.localRotation = Quaternion.Euler(xRotation, 0f, 0f);
    transform.Rotate(Vector3.up * mouseX);
}
```

The `Mathf.Clamp` on the vertical rotation was something we missed early on. Without it, you could look straight down and keep rotating — the camera would flip upside down and spin endlessly. Clamping it to -90 to +90 degrees solved that.

Getting the movement to feel good took longer. Speed, acceleration, the way momentum behaves when you stop — these things matter more than you'd expect. We tweaked constants for days until it felt natural, which is a strange thing to realize: the feel of movement in a game is mostly just careful math that nobody notices when it's right.

---

## 5. The Part I'm Most Proud Of — NavMesh AI

![NavMesh AI setup and pathfinding preview](https://res.cloudinary.com/dxclnybhc/image/upload/v1780927988/Screenshot_2026-06-08_at_7.43.00_PM_szaccn.png)


This is the system I spent the most time on, and honestly the part I'm most proud of getting to work.

The game has two types of AI characters: intelligent creatures that hunt the female character, and the female character herself who follows the player. Both use Unity's NavMesh system — a navigation mesh baked over the level geometry that lets characters understand the walkable space and find paths through it automatically.

Setting it up sounds straightforward. Bake a NavMesh, attach a NavMeshAgent, tell it where to go. The reality is more complicated.

**The creature AI** needed to do something specific: not just move toward the player, but specifically track and target the female character. They're not mindless. They prioritize. We implemented that with a simple but effective aggression logic — the creature continuously evaluates distance and line-of-sight to the female character's position and updates its NavMeshAgent destination accordingly.

```csharp
void Update() {
    if (target != null) {
        agent.SetDestination(target.position);

        float distance = Vector3.Distance(transform.position, target.position);
        if (distance <= attackRange) {
            AttackTarget();
        }
    }
}
```

The NavMeshAgent handles pathfinding through the level automatically. It navigates around walls, through corridors, up stairs — all without us manually programming any of that. What we control is the logic that decides *where* it's trying to go and *what* it does when it gets there.

**The female character** was a different challenge. She needed to follow the player closely, stay behind them, and react when danger was near. We used a state machine approach — a few clearly defined states (following, idle, reacting to threat) with transitions between them based on distance from the player and proximity to enemies.

```csharp
enum CharacterState { Following, Idle, Fleeing }

CharacterState currentState;

void Update() {
    float distanceToPlayer = Vector3.Distance(transform.position, player.position);
    float distanceToThreat = GetNearestThreatDistance();

    if (distanceToThreat < fleeThreshold) {
        currentState = CharacterState.Fleeing;
    } else if (distanceToPlayer > followDistance) {
        currentState = CharacterState.Following;
    } else {
        currentState = CharacterState.Idle;
    }

    ExecuteState();
}
```

The moment this worked in a real playtest — the player moving through a corridor, the female character keeping pace behind them, a creature breaking through a wall and immediately rerouting to intercept her — that was the moment it felt like a real game. That's the moment I knew we had actually built something.

Getting the NavMesh bake right took multiple tries. The mesh has to be configured correctly for agent height and radius, otherwise characters clip into geometry or get stuck at navigation edges. We iterated on that a lot. But once it was dialed in, the navigation was solid.

---

## 6. Getting 3D Assets Into the Game — Meshy AI Pipeline

We needed 3D assets — the creatures, environmental props, objects — and none of us were trained 3D modelers. We used **Meshy AI** to generate base meshes from text prompts, then brought them into Unity.

Here's the thing nobody tells you about AI-generated 3D assets: the raw output is almost never game-ready. The polygon counts are enormous. Meshes come in with overlapping geometry, non-manifold edges, topology that no game engine wants to touch. You can't just drop them into a scene and expect them to perform.

We had to retopologize every significant asset. That means rebuilding the mesh with cleaner, lower-poly geometry that preserves the shape of the original but removes all the waste. For props that weren't moving, we also used **LOD (Level of Detail)** — multiple versions of the same mesh at different polygon counts, with Unity automatically swapping to simpler versions as objects get farther from the camera.

The workflow we landed on:

1. Generate mesh in Meshy AI from a detailed text description
2. Import raw mesh into Blender, manually retopologize or use tools to reduce geometry intelligently
3. Re-bake normals from the high-poly original onto the low-poly clean mesh
4. Export as FBX, import into Unity
5. Set up LOD groups in the Unity inspector

It's a longer pipeline than just importing an asset, but the performance difference is significant. A creature that was 180,000 polygons raw became around 8,000 after retopology and still looked the same in-game.

---

## 7. Optimization and What We Learned Late

We learned about optimization the hard way — by building everything first, then discovering the frame rate was suffering.

A few things that made a real difference:

**Static batching** for environment geometry. Any object that doesn't move can be marked as static in Unity, which lets the engine batch draw calls together. We had hundreds of individual ProBuilder pieces in the level. Marking them static and letting Unity batch them dropped draw calls significantly.

**Physics collision layers**. By default, every collider checks against every other collider every frame. We set up a collision matrix in the project physics settings so that, for example, creature AI agents don't check against other creature AI agents. Unnecessary collision checks are a quiet performance killer.

**Baked lighting**. Real-time shadows are expensive. For static geometry — walls, floors, the environment — we baked lighting into lightmaps. Dynamic objects like the player and creatures still use real-time lighting, but the environment doesn't recalculate shadows every frame.

None of this is complicated in hindsight. But when you're building something for the first time, you don't think about it until you have to.

---

## 8. Version Control — The Painful Lesson

We used Google Drive for version control. I'll give you a moment to appreciate how bad that idea was.
