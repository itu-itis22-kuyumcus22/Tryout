using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using api.Data;
using api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class lastIdController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public lastIdController(ApplicationDBContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult GetAll()
        {
            var lastId = _context.IdTracker.ToList();
            Console.WriteLine("GetAll called!");
            return Ok(lastId);
        }
        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] lastIdTracker lastId)
        {
            if (id != lastId.Id)
            {
                Console.WriteLine("Not Found!");
                return BadRequest();
            }
            _context.Entry(lastId).State = EntityState.Modified;
            _context.SaveChanges();
            Console.WriteLine("Update called!");
            return Ok(lastId);
        }
    }
}