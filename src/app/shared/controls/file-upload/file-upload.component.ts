import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @Input() showFiles = true;
  @Input() mode;
  @Input() names;
  @Input() url;
  @Input() method;
  @Input() multiple;
  @Input() disabled;
  @Input() accept;
  @Input() maxFileSize;
  @Input() auto = true;
  @Input() withCredentials;
  @Input() invalidFileSizeMessageSummary;
  @Input() invalidFileSizeMessageDetail;
  @Input() invalidFileTypeMessageSummary;
  @Input() invalidFileTypeMessageDetail;
  @Input() previewWidth;
  @Input() chooseLabel = 'Choose';
  @Input() uploadLabel = 'Upload';
  @Input() cancelLabel = 'Cance';
  @Input() customUpload;
  @Input() showUploadButton;
  @Input() showCancelButton;
  @Input() dataUriPrefix;
  @Input() deleteButtonLabel;
  @Input() deleteButtonIcon = 'close';
  @Input() showUploadInfo;
  @Input() files: File[] = [];
  
  @ViewChild('fileUpload') fileUpload: ElementRef;

  inputFileName: string;
  
  @Output()
  addFiles: EventEmitter<File[]> = new EventEmitter<File[]>();

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // console.log(this.showFiles);
  }
  
  onClick(): void {
    if (this.fileUpload) {
      this.fileUpload.nativeElement.click();
    }
  }

  onFileSelected(event): void {
    const files: any[] = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    // console.log('event::::::', event)

    // files.forEach(
    //   (file, index) => {
    //     if (this.validate(file)) {
    //       file.objectURL = this.sanitizer.bypassSecurityTrustUrl( (window.URL.createObjectURL( files[index] )) );
    //       if (!this.isMultiple()) {
    //         this.files = [];
    //       }
    //       this.files.push(files[index]);
    //     }
    //   }
    // );
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (this.validate(file)) {
        file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
        if (!this.isMultiple()) {
          this.files = [];
        }
        this.files.push(files[i]);
      }
    }

    this.addFiles.emit(this.files);
  }

  // removeFile(event, file): void {
  removeFile(file): void {
    let ix;
    if (this.files && -1 !== (ix = this.files.indexOf(file))) {
      this.files.splice(ix, 1);
      this.clearInputElement();
    }
  }

  validate(file: File): boolean {
    for (const f of this.files) {
      if (f.name === file.name
        && f.lastModified === file.lastModified
        && f.size === f.size
        && f.type === f.type
      ) {
        return false;
      }
    }
    return true;
  }

  clearInputElement(): void {
    this.fileUpload.nativeElement.value = '';
  }

  isMultiple(): boolean {
    return this.multiple;
  }
}
