import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debounceTime, fromEvent, map, mergeAll, mergeMap, Observable, of, switchAll, switchMap } from 'rxjs';
import { Person } from './person.model';

@Component({
  selector: 'app-switch-merge',
  templateUrl: './switch-merge.component.html',
  styleUrls: ['./switch-merge.component.css']
})
export class SwitchMergeComponent implements OnInit {
  @ViewChild('searchBy', { static: true }) el: ElementRef;
  searchInput: string = "";
  people$?: Observable<Person[]>;
  private readonly url:string = 'http://localhost:9000';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    //this.firstOption();
    //this.secondOption();
    this.thirdOption();
  }

  filterPeople(searchInput: string): Observable<Person[]>{
    if(searchInput.length == 0){
      return of([]);
    }
    return this.http.get<Person[]>(`${this.url}/${searchInput}`);
  }

  firstOption(){
    fromEvent(this.el.nativeElement, 'keyup')
      .subscribe((e)=>{
        this.filterPeople(this.searchInput)
          .subscribe((r)=>{console.log(r)});
      })
  }

  secondOption(){
    let keyup$ = fromEvent(this.el.nativeElement, 'keyup');
    //let fetch$ = keyup$.pipe(map( (e)=>{return this.filterPeople(this.searchInput)} ));
    //this.people$ = fetch$.pipe(mergeAll());
    this.people$ = keyup$.pipe(mergeMap( (e) => { 
        return this.filterPeople(this.searchInput)
      }));

  }
  
  thirdOption(){
    let keyup$ = fromEvent(this.el.nativeElement, 'keyup');
    this.people$ = keyup$
      .pipe(
        debounceTime(700),
        switchMap( ()=>{ return this.filterPeople(this.searchInput) } ))
    /*
    this.people$ = keyup$.pipe(
      map( (e) =>{ return this.filterPeople(this.searchInput )} )
      ).pipe(switchAll());
    */
  }
}
