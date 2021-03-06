import { Component, Input, OnInit } from '@angular/core';
import { Valve } from 'src/app/_models/Valve';

@Component({
    selector: 'app-blokvalve',
    templateUrl: './blokvalve.component.html',
    styleUrls: ['./blokvalve.component.scss']
})

export class BlokvalveComponent implements OnInit {
    @Input() vd: Valve;

    constructor() {   }
    ngOnInit(): void {    }
}
