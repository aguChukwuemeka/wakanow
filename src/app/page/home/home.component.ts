import { stringify } from './../../../../node_modules/postcss/lib/postcss.d';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Status, UserData } from '../../core/interfaces/IUser-data';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user-service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    FlexLayoutModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  users!: UserData[];
  admin!: [];
  isAdmin!: boolean;
  displayedColumns = ['avatar', 'first_name', 'last_name', 'email', 'status'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();

    this.isAdmin = JSON.parse(sessionStorage.getItem('isAdmin') || '');
    this.admin = JSON.parse(sessionStorage.getItem('admin') || '');
    // const [admin] = JSON.stringify(this.admin);
    console.log(JSON.stringify(this.admin));
    this.users = JSON.parse(sessionStorage.getItem('users') || '');
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (users) => {
        this.dataSource = new MatTableDataSource(users.data);
        this.setupTable();
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  toggleApproval(user: any) {
    user.approved = !user.approved;
    this.users = [...this.users];
    sessionStorage.setItem('admin', JSON.stringify(this.users || []));
    console.log('toggle :', this.users);
  }

  setupTable() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
