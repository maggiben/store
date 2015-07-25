'use strict';

import { MasonryController } from './masonry.controller';
import { MasonryDirective } from './masonry.directive';

let controller = MasonryController;
let directive = MasonryDirective.directiveFactory;

export { controller };
export { directive };
