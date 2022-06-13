The data is stored in a very simple JSON structure.

>  
> Index File (`index.json`)  
> &nbsp;&nbsp;+-- Record Files (`x/xxx.json`)  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+-- Image Files (`x/xxx.jpg`)  
>  

That's it.  Nothing fancy.

* The "Index File" contain the list of "Record File" names (sans path and extension - those are determined procedurally).
  * the index file is sorted alphabetically, but that's just for convenience.  The search program resolves searches asynchronously, so that ordering is more-or-less irrelevant.
* Each "Record File" contains the kana, literal translation, english equivalents, definitions, and image file names (again, sans path and extension - the program assumes .jpg, but that can be explicitly defined to override).
* Image files are not technically required, but we made it a point early on that we didn't want to add a definition unless we had a good representational image to back it up.  
  * Each image is 400x400px and contains a publisher attribution statement.

The filenames are all based on the "literal translation" values.  Because we're using the literal translation this way, we sometimes fudge what constitutes a "literal translation".  For example, the entry for "fu fu" includes "fu fu fu".  It's close enough that anyone looking at it can figure out that it's just more of the same jōgo.
