import { Component } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable, delay } from 'rxjs';
import { ValidationErrors } from '@angular/forms';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

type Framework = {
  name: string,
  versions: string[],
}

const frameworks: Framework[] = [
  {
    name: 'Angular',
    versions: ['1.1.1', '1.2.1', '1.3.3']
  },
  {
    name: 'React',
    versions: ['2.1.2', '3.2.4', '4.3.1']
  },
  {
    name: 'Vue',
    versions: ['3.3.1', '5.2.1', '5.1.3']
  }
]


@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {}

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    framework: ['', Validators.required],
    frameworkVersion:[{value: '', disabled: true}, Validators.required],
    email:['', [Validators.required, Validators.email], this.asyncEmailValidator.bind(this)],
    hobbies: this.fb.array([
      this.fb.group({
        name: ['', Validators.required],
        duration: ['', Validators.required],
      }),
    ]),
  })

  frameworks = frameworks;

  get selectedFramework (): string[] | undefined {
    const selectedFramework = this.profileForm.get('framework')?.value;
    if(selectedFramework){
      return frameworks.find(framework => framework.name === selectedFramework)?.versions as string[];
    } else {
      return;
    }
  }

  onSelectFramework() {
    this.profileForm.controls['frameworkVersion'].enable();
  }

  asyncEmailValidator(control: FormControl): Observable<ValidationErrors | null> {
    return this.http.get(`https://emailverifierapi.com/v2/?apiKey=pF6a4LRdzM8rD7T3tWyUhQkVwPmc2IKN&email=${control.value}`)
    .pipe(
      map((response: any) => response.status !== 'failed' ? null : { emailExists: true }),
      delay(2000)
    );
  }


  get hobbies(): FormArray {
    return this.profileForm.get('hobbies') as FormArray;
  }

  addHobby(): void {
    const hobbyFormGroup = this.fb.group({
      name: ['', Validators.required],
      duration: ['', Validators.required],
    });

    this.hobbies.push(hobbyFormGroup);
  }

  onSubmit() {
    console.log(this.profileForm.value);
  }

}
