import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  OnDestroy,
  Optional,
  Self,
} from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/fisics/base/User';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ControlValueAccessor, NgControl, FormControl } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { MatFormFieldControl } from '@angular/material/form-field';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

/** Custom `MatFormFieldControl` for telephone number input. */
@Component({
  selector: 'people-picker-input',
  templateUrl: 'people-picker-input.html',
  styleUrls: ['people-picker-input.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: MyPeoplePickerInput },
  ],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
    '[class.example-selected]': 'isSelectedByUser',
  },
})
export class MyPeoplePickerInput
  implements ControlValueAccessor, MatFormFieldControl<User[]>, OnDestroy {
  static nextId = 0;

  selectValue: User;
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'people-picker-input';
  id = `people-picker-input-${MyPeoplePickerInput.nextId++}`;
  describedBy = '';
  onChange = (_: any) => {};
  onTouched = () => {};

  /* Variables del Control - Inicio */
  visible: boolean = true;
  selectable: boolean = false;
  removable: boolean = true;
  addOnBlur: boolean = false;

  filteredPeoples: Promise<User[]>;
  peoples: User[];
  allPeoples: User[];

  separatorKeysCodes = [ENTER, COMMA];

  peopleCtrl = new FormControl({ value: '', disabled: false });
  /* Variables del Control - Fin */
  constructor(
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl,
    private userService: UserService
  ) {
    _focusMonitor.monitor(_elementRef, true).subscribe((origin) => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    /* Control - Inicio */
    this.peoples = [];
    this.peopleCtrl.valueChanges
      .pipe(debounceTime(400))
      .subscribe((searchTerm) => {
        this.filteredPeoples = this.filter(searchTerm);
      });
    /* Control - Fin */

    this.disableInput(this._multiple);
  }

  /* Control - Inicio */
  @ViewChild('peopleInput', { static: true }) peopleInput: ElementRef;

  remove(people: any): void {
    const index = this.peoples.indexOf(people);

    if (index >= 0) {
      this.peoples.splice(index, 1);
    }
    this.disableInput(this._multiple);
  }

  filter(name: string) {
    return this.searchUser(name);
  }

  searchUser(searchValue: string): Promise<User[]> {
    return this.userService.searchUser(searchValue, this._nombregrupo);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.peopleInput.nativeElement.value = '';
    this.peopleCtrl.setValue(null);
    var that = this;
    this.userService
      .getUserIdEnsure(event.option.value.Key)
      .then(function (user_id) {
        event.option.value.Id = user_id;
        that.peoples.push(event.option.value);
        that.selectValue = event.option.value;
        if (that._multiple) {
          that.onChange(that.peoples);
        } else {
          that.onChange(event.option.value);
        }
        that.isSelectedByUser = true;
        that.disableInput(that._multiple);
      });
  }

  private isSelectedByUser: boolean = false;

  @Input()
  get nombregrupo(): string {
    return this._nombregrupo;
  }
  set nombregrupo(value: string) {
    this._nombregrupo = value;
    this.stateChanges.next();
  }
  private _nombregrupo: string;

  @Input()
  get usuariosseleccionados(): User[] {
    return this._usuariosseleccionados;
  }
  set usuariosseleccionados(value: User[]) {
    this._usuariosseleccionados = value;
    const prefixUrl =
      `${environment.proxyUrl}${environment.webRelativeUrl}` +
      '/_layouts/15/userphoto.aspx?size=S&accountname=';
    this._usuariosseleccionados.forEach((user: User) => {
      user.PictureUrl = prefixUrl + user.Email;
    });
    this.peoples = value;
    this.disableInput(this._multiple);
    this.stateChanges.next();
  }
  private _usuariosseleccionados: User[];
  /* Control - Fin */

  get empty() {
    const obj = this.selectValue;

    return !obj;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  disabledinput: boolean = false;
  placeholderinput: string = 'Escribe un nombre...';
  private _placeholder_tmp: string = this.placeholderinput;
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.disabledinput = value;
    this.removable = !value;
    if (value) {
      this.placeholderinput = 'Desactivado';
    } else {
      this.placeholderinput = this._placeholder_tmp;
    }
    this.stateChanges.next();
  }
  private _disabled = false;
  public dirty: boolean = true;

  @Input()
  get value(): User[] {
    return this.peoples;
  }
  set value(value: User[] | null) {
    if (value) {
      this._usuariosseleccionados = value;
      const prefixUrl =
        `${environment.proxyUrl}${environment.webRelativeUrl}` +
        '/_layouts/15/userphoto.aspx?size=S&accountname=';
      this._usuariosseleccionados.forEach((user: User) => {
        user.PictureUrl = prefixUrl + user.Email;
      });
      this.peoples = value;
    }
    this.disableInput(this._multiple);
    this.stateChanges.next();
  }

  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this._multiple = coerceBooleanProperty(value);
    this.disableInput(this._multiple);
    this.stateChanges.next();
  }
  private _multiple = true;

  disableInput(value: boolean) {
    if (value == false && this.peoples.length > 0) {
      this.disabledinput = !value;
      this.placeholderinput = '';
    } else if (value == false && this.peoples.length == 0) {
      this.disabledinput = value;
      this.placeholderinput = this._placeholder_tmp;
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this._elementRef.nativeElement.querySelector('input')!.focus();
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleInput(): void {
    this.onChange(this.selectValue);
  }
}
