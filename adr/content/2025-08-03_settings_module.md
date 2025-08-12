# ADR: Placement of the Settings Module and Controller

## Status

Accepted

## Context

The settings functionality is required by almost every other module in the application.  
The core settings logic should be placed in the shared (`@libs`)["../../libs"] namespace to ensure reusability and consistency.  

At the same time, a controller is needed to allow remote management of application settings. By convention, controllers and their parent modules belong to the main application rather than shared libraries.  
To respect this separation of concerns while keeping the architecture clear, an additional (`settings`)["../../src/settings/settings.module.ts"] module is introduced in the application layer.

## Decision

- The **core settings module** resides in (`@libs/settings`)["../../libs/settings/src"], providing all settings-related services and logic.
- In the main application, a (**secondary settings module**)["../../libs/settings/src/settings.module.ts"] exists under (`app/settings`)["../../src/settings"] whose only responsibility is to expose the (**settings controller**)["../../src/settings/settings.controller.ts"].
- The secondary settings module imports the (`@libs/settings`)["../../libs/settings/src/settings.module.ts"] module and injects its services into the controller.
- This approach maintains architectural clarity, avoids mixing controllers into shared libraries, and keeps the import paths for settings logic consistent.

## Consequences

- **Pros**:
  - Clean separation between shared logic and application-specific endpoints.
  - Easy discoverability of the settings controller in the application folder.
  - No duplication of the core settings logic.

- **Cons**:
  - Slightly more indirection, as there are now two modules named `settings`.

## Alternatives Considered

- Placing the controller directly in the `app` module and injecting the shared settings module — rejected in favor of encapsulating the controller in its own dedicated module for better modularity.
- Combining the controller with the shared settings logic in `@libs` — rejected due to mixing concerns and breaking conventions.
