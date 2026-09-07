drop procedure if exists HumanResources.GetDepartments
go

create procedure HumanResources.GetDepartments
    @PageNumber int = 1,
    @PageSize int = 10
as
    begin
        set nocount on
        select *, count(*) over() as TotalCount
        from HumanResources.Department
        order by DepartmentID
        offset(@PageNumber - 1) * @PageSize rows
        fetch next @PageSize rows only
    end
go

drop procedure if exists HumanResources.SelectDepartmentRegister
go

create procedure HumanResources.SelectDepartmentRegister
    @Name nvarchar(50) = null,
    @GroupName nvarchar(50) = null,
    @PageNumber int = 1,
    @PageSize int = 10
as begin
    set nocount on
    if @Name is not null
    begin
        select *
        from HumanResources.Department
        where Name = @Name
    end
    else if @GroupName is not null
    begin
        select *, count(*) over() as TotalCount
        from HumanResources.Department
        where GroupName = @GroupName
        order by DepartmentID
        offset(@PageNumber - 1) * @PageSize rows
        fetch next @PageSize rows only
    end
    else
    begin
        select 'Debe proporcionar Name o GroupName' as Message
    end
end
go

drop procedure if exists HumanResources.AddDepartmentRegister
go

create procedure HumanResources.AddDepartmentRegister
    @Name nvarchar(50),
    @GroupName nvarchar(50)
as
begin
    set nocount ON
    insert into HumanResources.Department (Name, GroupName, ModifiedDate)
    values (@Name,@GroupName, GETDATE())
    select scope_identity() AS NewDeparmentID
end
go

drop procedure if exists HumanResources.UpdateDepartmentRegister
go
create procedure HumanResources.UpdateDepartmentRegister
    @DepartmentID smallint,
    @Name nvarchar(50),
    @GroupName nvarchar(50)
as
begin
    set nocount on
    if exists (
        select 1
        from HumanResources.Department
        where DepartmentID = @DepartmentID
    )
    begin
        update HumanResources.Department
        set Name = @Name,
            GroupName = @GroupName,
            ModifiedDate = GETDATE()
        where DepartmentID = @DepartmentID
        select 'Departamento actualizado correctamente' as Message
    end
    else
    begin
        select 'No existe un deparmento con ese DepartmentID' as Message
    end
end
go

drop procedure if exists HumanResources.DeleteDepartmentRegister
go

create procedure HumanResources.DeleteDepartmentRegister
    @DepartmentID smallint
as
begin
    set nocount on

    if exists (
        select 1
        from HumanResources.Department
        where DepartmentID = @DepartmentID
    )
    begin
        delete from HumanResources.Department
        where DepartmentID = @DepartmentID

        select 'Departamento eliminado correctamente' as Message
    end
    else
    begin
        select 'No existe un departamento con ese DepartmentID' as Message
    end
end
go

drop procedure if exists HumanResources.GetEmployeeDepartmentHistory
go

create procedure HumanResources.GetEmployeeDepartmentHistory
    @PageNumber int = 1,
    @PageSize int = 10
as
begin
    set nocount on
    select
        (p.FirstName + ' ' + p.LastName) as EmployeeName,
        d.Name AS DepartmentName,
        d.GroupName,
        s.Name as Turno,
        edh.StartDate,
        edh.EndDate,
        edh.ModifiedDate,
        count(*) over() as TotalCount
    from HumanResources.EmployeeDepartmentHistory edh
    inner join HumanResources.Department d on edh.DepartmentID = d.DepartmentID
    inner join HumanResources.Shift s on edh.ShiftID = s.ShiftID
    inner join Person.Person p on edh.BusinessEntityID = p.BusinessEntityID
    order by edh.BusinessEntityID
    offset(@PageNumber - 1) * @PageSize rows
    fetch next @PageSize rows only
end
go

drop procedure if exists HumanResources.GetEmployeeDepartmentHistoryFiltered
go

create procedure HumanResources.GetEmployeeDepartmentHistoryFiltered
    @FirstName nvarchar(50) = NULL,
    @DepartmentName nvarchar(50) = NULL,
    @GroupName nvarchar(50) = NULL,
    @PageNumber int = 1,
    @PageSize int = 10
as
begin
    set nocount on

    if @FirstName is not null
    begin
        select
            (p.FirstName + ' ' + p.LastName) as EmployeeName,
            d.Name AS DepartmentName,
            d.GroupName,
            s.Name as Turno,
            edh.StartDate,
            edh.EndDate,
            edh.ModifiedDate
        from HumanResources.EmployeeDepartmentHistory edh
        inner join HumanResources.Department d on edh.DepartmentID = d.DepartmentID
        inner join HumanResources.Shift s on edh.ShiftID = s.ShiftID
        inner join Person.Person p on edh.BusinessEntityID = p.BusinessEntityID
        where p.FirstName = @FirstName
        order by edh.BusinessEntityID
        offset (@PageNumber - 1) * @PageSize rows
        fetch next @PageSize rows only
    end
    else if @DepartmentName is not null and @GroupName is not null
    begin
        select
            (p.FirstName + ' ' + p.LastName) as EmployeeName,
            d.Name AS DepartmentName,
            d.GroupName,
            s.Name as Turno,
            edh.StartDate,
            edh.EndDate,
            edh.ModifiedDate,
            count(*) over() as TotalCount
        from HumanResources.EmployeeDepartmentHistory edh
        inner join HumanResources.Department d on edh.DepartmentID = d.DepartmentID
        inner join HumanResources.Shift s on edh.ShiftID = s.ShiftID
        inner join Person.Person p on edh.BusinessEntityID = p.BusinessEntityID
        where d.Name = @DepartmentName and d.GroupName = @GroupName
        order by edh.BusinessEntityID
        offset (@PageNumber - 1) * @PageSize rows
        fetch next @PageSize rows only;
    end
    else if @DepartmentName is not null
    begin
        select
            (p.FirstName + ' ' + p.LastName) as EmployeeName,
            d.Name AS DepartmentName,
            d.GroupName,
            s.Name as Turno,
            edh.StartDate,
            edh.EndDate,
            edh.ModifiedDate,
            count(*) over() as TotalCount
        from HumanResources.EmployeeDepartmentHistory edh
        inner join HumanResources.Department d on edh.DepartmentID = d.DepartmentID
        inner join HumanResources.Shift s on edh.ShiftID = s.ShiftID
        inner join Person.Person p on edh.BusinessEntityID = p.BusinessEntityID
        where d.Name = @DepartmentName
        order by edh.BusinessEntityID
        offset (@PageNumber - 1) * @PageSize rows
        fetch next @PageSize rows only;
    end
    else if @GroupName is not null
    begin
        select
            (p.FirstName + ' ' + p.LastName) as EmployeeName,
            d.Name AS DepartmentName,
            d.GroupName,
            s.Name as Turno,
            edh.StartDate,
            edh.EndDate,
            edh.ModifiedDate,
            count(*) over() as TotalCount
        from HumanResources.EmployeeDepartmentHistory edh
        inner join HumanResources.Department d on edh.DepartmentID = d.DepartmentID
        inner join HumanResources.Shift s on edh.ShiftID = s.ShiftID
        inner join Person.Person p on edh.BusinessEntityID = p.BusinessEntityID
        where d.GroupName = @GroupName
        order by edh.BusinessEntityID
        offset (@PageNumber - 1) * @PageSize rows
        fetch next @PageSize rows only
    end
    else
    begin
        select 'Debe proporcionar FirstName, DepartmentName o GroupName' as Message
    end
end
go
