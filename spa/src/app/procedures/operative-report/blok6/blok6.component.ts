import { Component, Input } from '@angular/core';
import { previewReport } from 'src/app/_models/previewReport';
@Component({
    selector: 'app-blok6',
    templateUrl: './blok6.component.html',
    styleUrls: ['./blok6.component.scss']
})

export class Blok6Component {
    @Input() pre: previewReport;

    constructor() {

    }
}
