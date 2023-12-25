---
title: WebAPI
date: 2023-12-25T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## RESTful API
```csharp
[Route("api/[controller]")]
[ApiController]
public class ValuesController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<string>> Get()
    {
        return new string[] { "value1", "value2" };
    }
    [HttpGet("{id}")]
    public ActionResult<string> Get(int id)
    {
        return "value";
    }
}
```
## RPC API
`/api/Values/Get?id=1`
