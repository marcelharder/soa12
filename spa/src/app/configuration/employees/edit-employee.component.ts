import { Component, OnInit } from '@angular/core';
import { dropItem } from '../../_models/dropItem';
import { HospitalService } from '../../_services/hospital.service';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { User } from '../../_models/User';
import { AlertifyService } from '../../_services/alertify.service';
import { Employee } from '../../_models/Employee';
import { EmployeeService } from '../../_services/employee.service';
import { DropdownService } from '../../_services/dropdown.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit-employee',
    templateUrl: './edit-employee.component.html',
    styleUrls: ['./edit-employee.component.scss']
})

export class EditEmployeeComponent implements OnInit {
    user: User;
    // list of professions
    surgeon = 'surgery';
    assistant = 'surgery';
    anaesthesiaTech = 'anaesthesieTech';
    anaesthesia = 'anaesthesie';
    nurse = 'nurse';
    perfusie = 'perfusion';




    edit = '1';
    id = 0;

    currentUserId = 0;
    currentHospital = 0;
    hospitalName = '';
    hospitalImage = '';
    selectedPersonValue = 0;
    activeState = false;




    
    emp: Employee = {
        id: 0,
        name: '',
        active: '',
        activeState: false,
        image: 'https://res.cloudinary.com/marcelcloud/image/upload/v1559818775/user.png.jpg',
        profession: '',
        user_name: '',
        password: '',
        liscense_to_kill: '',
        selected_hospital_id: 0
    }

    sl: Array<dropItem> = [];
    al: Array<dropItem> = [];
    hl: Array<dropItem> = [];
    cl: Array<dropItem> = [];
    tl: Array<dropItem> = [];
    pl: Array<dropItem> = [];
    optionsYN: Array<dropItem> = [];

    constructor(private hospitalservice: HospitalService,
        private auth: AuthService,
        private router: Router,
        private drops: DropdownService,
        private alertify: AlertifyService,
        private employeeservice: EmployeeService,
        private userservice: UserService) { }

    ngOnInit(): void {
        this.edit = '0';
        this.loadDrops();
        this.auth.currentHospital.subscribe((res) => { this.hospitalName = res; });
        this.currentUserId = +this.auth.decodedToken.nameid;
        this.userservice.getUser(this.currentUserId).subscribe((response) => {
            this.user = response;
            this.currentHospital = this.user.hospital_id;
            // get the employees

            this.drops.getEmployees(this.currentHospital.toString(),'surgery','true','Yes').subscribe((next)=>{this.sl = next}); // surgeons
            this.drops.getEmployees(this.currentHospital.toString(),'surgery','true','No').subscribe((next)=>{this.al = next}); // assistant
            this.drops.getEmployees(this.currentHospital.toString(),'anaesthesie','true','No').subscribe((next)=>{this.hl = next}); // an
            this.drops.getEmployees(this.currentHospital.toString(),'nurse','true','No').subscribe((next)=>{this.cl = next}); // nurse
            this.drops.getEmployees(this.currentHospital.toString(),'anaesthesieTech','true','No').subscribe((next)=>{this.tl = next}); // tech
            this.drops.getEmployees(this.currentHospital.toString(),'perfusion','true','No').subscribe((next)=>{this.pl = next}); // perf




            // get the hospital image
            this.hospitalservice.getSpecificHospital(this.currentHospital).subscribe((res) => {
                this.hospitalImage = res.imageUrl;
            })

        });
    }


    editEmployee(id: string) {
        this.edit = '1';
        this.employeeservice.getEmployeeDetails(parseInt(id, 10)).subscribe((next) => {
            this.emp = next;
            if(this.emp.active === 'True'){this.emp.activeState = true} else {this.emp.activeState = false}
        });
    }
    addEmployee(soort: string) {
        this.edit = '1';

        this.employeeservice.addEmployee(soort).subscribe((next) => {
            // this should generate a new employee with a profession, which is passed up in soort
            this.emp = next; });
    }
    showEditForm() { if (this.edit === '1') { return true; } }
    loadDrops() {
        const d = JSON.parse(localStorage.getItem('YN'));
        if (d == null || d.length === 0) {
            this.drops.getYNOptions().subscribe((response) => {
                this.optionsYN = response; localStorage.setItem('YN', JSON.stringify(response));
            });
        } else {
            this.optionsYN = JSON.parse(localStorage.getItem('YN'));
        }
    }
    cancel() {
        this.edit = '0';
        this.emp =
        {
            id: 0,
            name: '',
            active: '',
            activeState: false,
            image: 'https://res.cloudinary.com/marcelcloud/image/upload/v1559818775/user.png.jpg',
            profession: '',
            user_name: '',
            password: '',
            liscense_to_kill: '',
            selected_hospital_id: 0
        };
    }
    deleteEmployee() {
        this.employeeservice.deleteEmployee(this.emp.id).subscribe((next) => {

            this.alertify.message('Employee deleted ...');
            this.router.navigate(['/configuration']);
        });
    }
    saveEmployee(activeState: boolean) {
        if (this.emp.activeState) { this.emp.active = 'True'; } else { this.emp.active = 'False'; }
        this.employeeservice.updateEmployee(this.emp).subscribe((next) => {
            this.alertify.message('Employee updated ...');
            this.router.navigate(['/configuration']);
        });
    }
    updatePhoto(photoUrl: string) { this.emp.image = photoUrl; }

}
