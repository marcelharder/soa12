import { Component, Input } from '@angular/core';
import { previewReport } from 'src/app/_models/previewReport';

@Component({
    selector: 'app-blok1',
    templateUrl: './blok1.component.html',
    styleUrls: ['./blok1.component.scss']
})

export class Blok1Component {
    @Input() pre: previewReport;

    constructor() {

    }
}
