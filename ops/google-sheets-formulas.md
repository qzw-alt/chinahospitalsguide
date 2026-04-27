# Google Sheets formulas and rules

Use these only if you want lightweight automation without adding another system.

## Useful helper columns

If you add helper columns on the right side of your lead sheet, these are useful:

### 1. overdue_flag

Returns `OVERDUE` when the follow-up date is today or earlier and the case is still open.

```gs
=IF(AND(TODAY()>=VALUE(T2),N2<>"Closed"),"OVERDUE","")
```

Assumes:
- `T` = `next_follow_up_date`
- `N` = `lead_status`

### 2. paid_flag

```gs
=IF(LEFT(M2,4)="Paid","YES","NO")
```

Assumes:
- `M` = `payment_status`

### 3. response_bucket

```gs
=IF(N2="Closed","Closed",IF(TODAY()>VALUE(T2),"Late",IF(TODAY()=VALUE(T2),"Today","Upcoming")))
```

## Suggested conditional formatting custom formulas

Apply these to your data range, for example:

`A2:X`

### 1. overdue follow-up

```gs
=AND($T2<>"",$N2<>"Closed",TODAY()>$T2)
```

Color:
- background red
- text dark red

### 2. due today

```gs
=AND($T2<>"",$N2<>"Closed",TODAY()=$T2)
```

Color:
- background amber

### 3. paid client waiting

```gs
=AND(LEFT($M2,4)="Paid",LEFT($O2,8)="Awaiting")
```

Color:
- background light green

### 4. new lead

```gs
=$N2="New lead"
```

Color:
- background light blue

### 5. closed

```gs
=$N2="Closed"
```

Color:
- background light gray

## Simple dashboard formulas

Assuming your main lead sheet is named:

`customer-leads-template`

### New leads today

```gs
=COUNTIFS('customer-leads-template'!B:B,">="&TODAY(),'customer-leads-template'!N:N,"New lead")
```

### Need reply today

```gs
=COUNTIFS('customer-leads-template'!T:T,"<="&TODAY(),'customer-leads-template'!N:N,"<>Closed")
```

### Paid cases open

```gs
=COUNTIFS('customer-leads-template'!M:M,"Paid*", 'customer-leads-template'!N:N,"<>Closed")
```

### Waiting for records

```gs
=COUNTIFS('customer-leads-template'!O:O,"Awaiting records",'customer-leads-template'!N:N,"<>Closed")
```

## Recommended no-stress setup

If formulas feel like too much, do only these first:

1. add filter views
2. add overdue conditional formatting
3. add a simple Dashboard count for:
   - new leads
   - paid cases
   - waiting for records
