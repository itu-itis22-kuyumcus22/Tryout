using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Employee
    {
        public Employee(int id, string name, int salary, string department)
        {
            this.id = id;
            this.name = name;
            this.salary = salary;
            this.department = department;
        }
        public int id { get; set; }
        public string name { get; set; }
        public int salary { get; set; }
        public string department { get; set; }
    }
}