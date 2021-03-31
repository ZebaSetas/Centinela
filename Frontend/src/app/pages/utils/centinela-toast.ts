
import {NbComponentStatus,NbGlobalPosition, NbToastrService,NbGlobalPhysicalPosition } from '@nebular/theme';
export class CentinelaToast{

  destroyByClick = true;
  duration = 3000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  index = 1;
  status: NbComponentStatus = 'primary';
  types: NbComponentStatus[] = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ];
  toastrService:NbToastrService;

  constructor(toastrService:NbToastrService){
    this.toastrService = toastrService;
  }

  showToast(numberType:number, title: string, body: string) {
    var type = this.types[numberType];
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    const titleContent = title ? `${title}` : '';
    this.index += 1;
    this.toastrService.show(
      body,
      `${titleContent}`,
      config);
  }  
}