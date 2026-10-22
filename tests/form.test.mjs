import test from 'node:test';
import assert from 'node:assert/strict';
import { handleForm } from '../worker/form.js';
const request = (fields, headers={}) => new Request('https://fxneurope.eu/netlify-forms.html',{method:'POST',headers,body:new URLSearchParams(fields)});
const valid = {name:'Test',email:'test@example.org',message:'Test message'};
test('rejects invalid forms and foreign origins without sending',async()=>{
 const never = ()=>assert.fail('must not send');
 assert.equal((await handleForm(request({}),{},never)).status,400);
 assert.equal((await handleForm(request(valid,{Origin:'https://example.org'}),{},never)).status,403);
 assert.equal((await handleForm(request({...valid,email:'test@example.org\r\nBcc:x@y.z'}),{},never)).status,400);
 assert.equal((await handleForm(request({...valid,message:'x'.repeat(65537)}),{},never)).status,413);
 assert.equal((await handleForm(request({'bot-field':'spam'}),{},never)).status,200);
});
test('reports delivery failures honestly and succeeds only after sender confirms',async()=>{
 assert.equal((await handleForm(request(valid),{},async()=>({ok:false,reason:'not_configured'}))).status,503);
 assert.equal((await handleForm(request(valid),{},async()=>({ok:false,reason:'send_failed'}))).status,502);
 let sent;
 assert.equal((await handleForm(request(valid),{},async(_env,message)=>{sent=message;return {ok:true}})).status,200);
 assert.equal(sent.replyTo,valid.email);
 assert.ok(sent.text.includes(valid.message));
});
