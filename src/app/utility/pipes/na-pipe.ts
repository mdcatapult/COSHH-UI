/*
 * Copyright 2024 Medicines Discovery Catapult
 * Licensed under the Apache License, Version 2.0 (the "Licence");
 * you may not use this file except in compliance with the Licence.
 * You may obtain a copy of the Licence at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'NA' })
export class NAPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return '';
        if (value.toUpperCase() === 'N/A' || value.toUpperCase() === 'NA') {
            return 'N/A';
        } else return value;
    }
}