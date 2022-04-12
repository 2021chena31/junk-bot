drop table if exists UserXP;

create table UserXP (
  internal_id integer  primary key autoincrement,
  user_id     text     not null    unique,
  xp          integer
);

drop table if exists Reminders;

create table Reminders (
  internal_id integer primary key autoincrement,
  user_id     text    not null,
  channel_id  text    not null,
  contents    text    not null,
  date_time   integer not null
)
