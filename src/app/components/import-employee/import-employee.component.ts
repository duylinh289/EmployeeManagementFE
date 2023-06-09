import { Component, OnInit } from '@angular/core';
import { read, utils, writeFile } from 'xlsx';
import { EmployeeModel } from 'src/app/models/employee-model';
import { MatTableDataSource } from '@angular/material/table';
import { ImportEmployeeModel } from 'src/app/models/import-employee-models';
import { EmployeeApiService } from 'src/app/services/employee-api.service';
import { AppComponent } from 'src/app/app.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-import-employee',
  templateUrl: './import-employee.component.html',
  styleUrls: ['./import-employee.component.css'],
})
export class ImportEmployeeComponent implements OnInit {
  constructor(
    private dialogRefernce: MatDialogRef<ImportEmployeeComponent>,
    private employeeService: EmployeeApiService,
    private appComponent: AppComponent
  ) {}
  dataEmployee = new MatTableDataSource<ImportEmployeeModel>();
  ngOnInit(): void {}

  res: any;
  handleImport($event: any) {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          //
          this.employeeService.checkDataImport(rows).subscribe((x) => {
            this.res = x;
            this.dataEmployee.data = this.res.message;
          },
            (error) => {
              console.log(error.error);
              this.appComponent.showSnackbarError(
                error.error.message,
                'Failed to import!',
                5000
              );
            }
          );
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  Save() {
    this.employeeService.saveImport(this.dataEmployee.data).subscribe((x) => {
      this.res = x;
      if ((this.res.code = 'Success')) {
        this.appComponent.showSnackbar(
          'Import succesfully!',
          'Success!',
          5000
        );
        this.dialogRefernce.close('imported');
      }
      else{
        this.appComponent.showSnackbar(
          this.res.message,
          'Failed to import!',
          5000
        );
      }
    },
      (error) => {
        this.appComponent.showSnackbarError(
          'List import have error, please check again',
          'Failed to import!',
          5000
        );
      }
    );

  }
}
