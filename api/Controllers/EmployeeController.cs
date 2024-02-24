using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public EmployeeController(ApplicationDBContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult GetAll()
        {
            var emp = _context.Emparr.ToList();
            Console.WriteLine("GetAll called!");
            return Ok(emp);
        }
        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            Employee emp = _context.Emparr.Find(id);
            if (emp == null)
            {
                return NotFound();
            }
            Console.WriteLine("GetById called!");
            return Ok(emp);
        }
        [HttpPost]
        public IActionResult Create([FromBody] Employee emp)
        {
            try
            {
                _context.Emparr.Add(emp);
                _context.SaveChanges();
                Console.WriteLine("Create called!");
                return CreatedAtAction(nameof(GetById), new { id = emp.id }, emp);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] Employee emp)
        {
            if (id != emp.id)
            {
                Console.WriteLine("Not Found!");
                return BadRequest();
            }
            _context.Entry(emp).State = EntityState.Modified;
            try
            {
                Console.WriteLine("Update called!");
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (_context.Emparr.Find(id) == null)
                {
                    Console.WriteLine("Not Found! 2");
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }
        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            Employee emp = _context.Emparr.Find(id);
            if (emp == null)
            {
                Console.WriteLine("Delete not found");
                return NotFound();
            }
            _context.Emparr.Remove(emp);
            _context.SaveChanges();
            Console.WriteLine("Delete called!");
            return NoContent();
        }
        
    }
}