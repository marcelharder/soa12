import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { previewReport } from '../../_models/previewReport';
import { CABG } from '../../_models/CABG';
import { PreViewReportService } from '../../_services/pre-view-report.service';
import { ProcedureService } from '../../_services/procedure.service';
import { ProcedureDetails } from '../../_models/procedureDetails';
import { FinalReportService } from '../../_services/final-report.service';
import { reportHeader } from '../../_models/reportHeader';
import { AlertifyService } from '../../_services/alertify.service';
import { environment } from '../../../environments/environment';
import { Suggestion } from '../../_models/Suggestion';
import { Valve } from '../../_models/Valve';
import { CABGService } from '../../_services/cabg.service';
import { ValveService } from '../../_services/valve.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { EmailModel } from 'src/app/_models/EmailModel';
import { RefPhysService } from 'src/app/_services/ref-phys.service';
import { RefPhysModel } from 'src/app/_models/RefPhysModel';
@Component({
  selector: 'app-preview-report',
  templateUrl: './preview-report.component.html',
  styleUrls: ['./preview-report.component.scss']
})



export class PreviewReportComponent implements OnInit {
  @ViewChild('preViewForm') preViewForm: NgForm;
  procedureId = 0;
  reportCode = 0;
  locationURL = environment.locationUrl;
  refEmail = '0';
  

  reportHeader: reportHeader = {
    Id: 0,
    surgeon_picture: '',
    hospital_name: '',
    hospital_image: '',
    hospital_unit: '',
    hospital_dept: '',
    hospital_city: '',
    hospital_number: '',
    patient_name: '',
    physician: '',
    clinical_unit: '',
    title: '',
    diagnosis: '',
    operation: '',
    operation_date: new Date(),
    surgeon: '',
    assistant: '',
    anaesthesiologist: '',
    perfusionist: '',
    Comment_1: '',
    Comment_2: '',
    Comment_3: ''
  };

  prev: previewReport;
  sug: Suggestion;
  proc: ProcedureDetails;
  cabgDetails: CABG;
  valveDetails: Valve;
  // tslint:disable-next-line:max-line-length
  ref: RefPhysModel = { Id: 0, hospital_id: 0, name: '', image: '', address: '', street: '', postcode: '', city: '', state: '', country: '', tel: '', fax: '', email: '', send_email: false, active: false };
  email: EmailModel = { id: 0, from: '', to: '', subject: '', body: '', surgeon: '', phone: '',surgeon_image: '', soort: '', hash: '' };
  MitralValveDetails = { Model: '', Serial: '', Size: '' };
  AorticValveDetails = { Model: '', Serial: '', Size: '' };

  blok1 = 0;
  blok2 = 0;
  cabg = 0;
  aorticvalve = 0;
  mitralvalve = 0;
  blok6 = 0;

  baseUrl = environment.apiUrl;


  constructor(private route: ActivatedRoute,
    private refPhys: RefPhysService,
    private router: Router,
    private auth: AuthService,
    private procedureservice: ProcedureService,
    private cabgService: CABGService,
    private valveService: ValveService,
    private final: FinalReportService,
    private alertify: AlertifyService,
    private preview: PreViewReportService) { }

  ngOnInit() {
   
    this.route.data.subscribe(data => {
      this.prev = data.preView;
      this.procedureId = this.prev.procedure_id;
      this.procedureservice.getProcedure(this.procedureId).subscribe((next) => {
        this.proc = next;
        this.refPhys.getSpecificRefPhys(+this.proc.refPhys).subscribe((ne) => { this.ref = ne; })
        this.preview.getReportCode(this.proc.fdType).subscribe((nex) => {
          this.reportCode = nex;
           this.getAdditionalStuff(this.reportCode);// gets the cabg / valve details
        });
      });
    });
    this.preview.getReportHeader(this.procedureId).subscribe((next) => { this.reportHeader = next; });
  }



  acceptMessage(id: number) {// get the button actions from the header component
    switch (id) {
      case 1: this.clearReport(); break;
      case 2: this.composeAndSendMailMessage(); break;
      case 4: this.saveAsSuggestion(); break;
    }
  };

  cancelEmailRef($event: any){
    this.refEmail = '0';
  }

  composeAndSendMailMessage() {
      this.refEmail = '1';
       this.procedureservice.getRefPhysEmailHash(this.proc.procedureId)
      .subscribe((next) => {

        this.email.id = this.reportHeader.Id;
        this.email.from = 'info@cardiacsoftwaredevelopers.com';
        this.email.subject = 'Procedure notification';
        this.email.surgeon = this.auth.decodedToken.unique_name;
        this.email.surgeon_image = this.reportHeader.surgeon_picture;
        this.email.to = this.ref.email;
        this.email.phone = this.ref.tel,
        this.email.soort = '1';
        this.email.hash = next;
        this.email.body = 'Dear dr. '+ this.ref.name + ' your patient named ' +
                           this.reportHeader.patient_name + ' was diagnosed with ' +
                           this.reportHeader.diagnosis + ' , we performed a ' +
                           this.reportHeader.operation + ' today. We will keep you informed about the subsequent clinical course of your patient. ' +
                           'You can find the operative report by following this link: '+
                           this.locationURL +'FinalOperativeReport/getRefReport/' + this.email.hash;
      })
  }
  showEmailRefPhys(){if(this.refEmail === '1'){return true;}}

  saveAndPrint(rh: reportHeader) {
    this.prev.Diagnosis = rh.diagnosis;
    this.prev.MedicalRecordNumber = rh.hospital_number;
    this.prev.patientName = rh.patient_name;
    this.final.postReportId(this.prev).subscribe((next) => { },
      () => { },
      () => {
        window.location.href = this.baseUrl + 'finalOperativeReport/' + this.prev.procedure_id;
      });
  }
  clearReport() {
    // wipe out the current content of pre
    this.wipeOutPre();
   // this.preview.resetPreView(this.procedureId).subscribe((next)=>{this.prev = next;})
     this.preview.resetPreView(this.procedureId).subscribe((next)=>{this.prev = next;})
  }

  saveAsSuggestion() {
    // save the current preview report details which get transformed to a suggestion on the server
    this.preview.saveSuggestion(this.prev, this.proc.fdType).subscribe((next) => {
      this.alertify.message('Saved as custom suggestion');
    }, (error) => { this.alertify.error(error); });

  }
  wipeOutPre() {
    this.prev.regel_1 = '';
    this.prev.regel_2 = '';
    this.prev.regel_3 = '';
    this.prev.regel_4 = '';
    this.prev.regel_5 = '';
    this.prev.regel_6 = '';
    this.prev.regel_7 = '';
    this.prev.regel_8 = '';
    this.prev.regel_9 = '';
    this.prev.regel_10 = '';
    this.prev.regel_11 = '';
    this.prev.regel_12 = '';
    this.prev.regel_13 = '';
    this.prev.regel_14 = '';
    this.prev.regel_15 = '';
    this.prev.regel_16 = '';
    this.prev.regel_17 = '';
    this.prev.regel_18 = '';
    this.prev.regel_19 = '';
    this.prev.regel_20 = '';
    this.prev.regel_21 = '';
    this.prev.regel_22 = '';
    this.prev.regel_23 = '';
    this.prev.regel_24 = '';
    this.prev.regel_25 = '';
    this.prev.regel_26 = '';
    this.prev.regel_27 = '';
    this.prev.regel_28 = '';
    this.prev.regel_29 = '';
    this.prev.regel_30 = '';
    this.prev.regel_31 = '';
    this.prev.regel_32 = '';
    this.prev.regel_33 = '';



  }

  getAdditionalStuff(code: number) {
    switch (code) {

      case 1: this.getCabgStuff(this.prev.procedure_id); break;
      case 2: this.getCabgStuff(this.prev.procedure_id); break;
      case 3: this.getAorticValveStuff(this.prev.procedure_id); break;
      case 4: this.getMitralValveStuff(this.prev.procedure_id); break;
      case 5: this.getMitralValveStuff(this.prev.procedure_id); this.getAorticValveStuff(this.prev.procedure_id); break;


    }

  }
  getMitralValveStuff(id: number) {
    this.valveService.getValves(id).subscribe((next) => {
     // find the mitralvalve first
     var index = next.findIndex(a => a.Implant_Position === "Mitral");
     // and get model/size/serial
     this.MitralValveDetails.Model = next[index].MODEL;
     this.MitralValveDetails.Size = next[index].SIZE;
     this.MitralValveDetails.Serial = next[index].SERIAL_IMP;
    }, (error) => {
      this.alertify.error(error);
    })
  }
  getAorticValveStuff(id: number) {
    this.valveService.getValves(id).subscribe((next) => {
       // find the aorticvalve first
     var index = next.findIndex(a => a.Implant_Position === "Aortic");
      this.AorticValveDetails.Model = next[index].MODEL;
      this.AorticValveDetails.Size = next[index].SIZE;
      this.AorticValveDetails.Serial = next[index].SERIAL_IMP;
    }, (error) => {
      this.alertify.error(error);
    })
  }
  getCabgStuff(id: number) {
   
    this.cabgService.getCABG(id.toString()).subscribe((next) => {
     
      this.cabgDetails = next;
    }, (error) => {

      this.alertify.error(error);
    })
  }




  canDeactivate() {
    this.alertify.confirm('Sure you want to go ?', () => {
      this.preViewForm.reset();
      return true;
    });
    return false;
  }


}

