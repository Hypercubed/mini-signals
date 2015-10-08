## Classes
<dl>
<dt><a href="#MiniSignalBinding">MiniSignalBinding</a></dt>
<dd></dd>
<dt><a href="#MiniSignal">MiniSignal</a></dt>
<dd></dd>
</dl>
<a name="MiniSignalBinding"></a>
## MiniSignalBinding
**Kind**: global class  
**Api**: private  
<a name="new_MiniSignalBinding_new"></a>
### new MiniSignalBinding(fn, [once])
MiniSignalBinding constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fn | <code>function</code> |  | Event handler to be called. |
| [once] | <code>Boolean</code> | <code>false</code> | Should this listener be removed after dispatch |

<a name="MiniSignal"></a>
## MiniSignal
**Kind**: global class  
**Api**: public  

* [MiniSignal](#MiniSignal)
  * [new MiniSignal()](#new_MiniSignal_new)
  * [.handlers([exists])](#MiniSignal+handlers) ⇒ <code>[Array.&lt;MiniSignalBinding&gt;](#MiniSignalBinding)</code> &#124; <code>Boolean</code>
  * [.dispatch()](#MiniSignal+dispatch) ⇒ <code>Boolean</code>
  * [.add(fn)](#MiniSignal+add) ⇒ <code>[MiniSignalBinding](#MiniSignalBinding)</code>
  * [.once(fn)](#MiniSignal+once) ⇒ <code>[MiniSignalBinding](#MiniSignalBinding)</code>
  * [.detach(node)](#MiniSignal+detach) ⇒ <code>[MiniSignal](#MiniSignal)</code>
  * [.detachAll()](#MiniSignal+detachAll) ⇒ <code>[MiniSignal](#MiniSignal)</code>

<a name="new_MiniSignal_new"></a>
### new MiniSignal()
MiniSignal constructor.

**Example**  
```js
let mySignal = new MiniSignal();
let binding = mySignal.add(onSignal);
mySignal.dispatch('foo', 'bar');
mySignal.detach(binding);
```
<a name="MiniSignal+handlers"></a>
### miniSignal.handlers([exists]) ⇒ <code>[Array.&lt;MiniSignalBinding&gt;](#MiniSignalBinding)</code> &#124; <code>Boolean</code>
Return an array of attached MiniSignalBinding.

**Kind**: instance method of <code>[MiniSignal](#MiniSignal)</code>  
**Returns**: <code>[Array.&lt;MiniSignalBinding&gt;](#MiniSignalBinding)</code> &#124; <code>Boolean</code> - Array of attached MiniSignalBinding or Boolean if called with exists = true  
**Api**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [exists] | <code>Boolean</code> | <code>false</code> | We only need to know if there are handlers. |

<a name="MiniSignal+dispatch"></a>
### miniSignal.dispatch() ⇒ <code>Boolean</code>
Dispaches a signal to all registered listeners.

**Kind**: instance method of <code>[MiniSignal](#MiniSignal)</code>  
**Returns**: <code>Boolean</code> - Indication if we've emitted an event.  
**Api**: public  
<a name="MiniSignal+add"></a>
### miniSignal.add(fn) ⇒ <code>[MiniSignalBinding](#MiniSignalBinding)</code>
Register a new listener.

**Kind**: instance method of <code>[MiniSignal](#MiniSignal)</code>  
**Returns**: <code>[MiniSignalBinding](#MiniSignalBinding)</code> - The MiniSignalBinding node that was added.  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Callback function. |

<a name="MiniSignal+once"></a>
### miniSignal.once(fn) ⇒ <code>[MiniSignalBinding](#MiniSignalBinding)</code>
Register a new listener that will be executed only once.

**Kind**: instance method of <code>[MiniSignal](#MiniSignal)</code>  
**Returns**: <code>[MiniSignalBinding](#MiniSignalBinding)</code> - The MiniSignalBinding node that was added.  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Callback function. |

<a name="MiniSignal+detach"></a>
### miniSignal.detach(node) ⇒ <code>[MiniSignal](#MiniSignal)</code>
Remove binding object.

**Kind**: instance method of <code>[MiniSignal](#MiniSignal)</code>  
**Returns**: <code>[MiniSignal](#MiniSignal)</code> - The instance on which this method was called.  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>[MiniSignalBinding](#MiniSignalBinding)</code> | The binding node that will be removed. |

<a name="MiniSignal+detachAll"></a>
### miniSignal.detachAll() ⇒ <code>[MiniSignal](#MiniSignal)</code>
Detach all listeners.

**Kind**: instance method of <code>[MiniSignal](#MiniSignal)</code>  
**Returns**: <code>[MiniSignal](#MiniSignal)</code> - The instance on which this method was called.  
**Api**: public  
