import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "./AdminDashboard.css";
import { API_BASE as API, PLACEHOLDER_IMAGE } from "../services/api";

const emptyForm = { name:"", description:"", price:"", discountPrice:"", image:"", category:"", stock:"", brand:"" };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { refreshProducts } = useAppContext();
  const [products,setProducts]=useState([]), [categories,setCategories]=useState([]);
  const [form,setForm]=useState(emptyForm), [editingId,setEditingId]=useState(null);
  const [loading,setLoading]=useState(true), [saving,setSaving]=useState(false), [message,setMessage]=useState("");

  const loadData=async()=>{
    try{
      setLoading(true);
      const [pr,cr]=await Promise.all([fetch(`${API}/product/get`),fetch(`${API}/category/get`)]);
      const pd=await pr.json(), cd=await cr.json();
      setProducts(pd.products||[]); setCategories(cd.categories||[]);
      if(!form.category && cd.categories?.length) setForm(f=>({...f,category:cd.categories[0]._id}));
    }catch{setMessage("Backend connect nahi ho raha. Server 8095 par start karo.");}
    finally{setLoading(false);}
  };
  useEffect(()=>{loadData()},[]);
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  const reset=()=>{setForm({...emptyForm,category:categories[0]?._id||""});setEditingId(null)};
  const submit=async e=>{
    e.preventDefault();
    if(!form.category){setMessage("Pehle category select karo.");return}
    try{
      setSaving(true);setMessage("");
      const url=editingId?`${API}/product/update/${editingId}`:`${API}/product/add`;
      const res=await fetch(url,{method:editingId?"PUT":"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...form,price:Number(form.price),discountPrice:Number(form.discountPrice||0),stock:Number(form.stock||0)})});
      const data=await res.json(); if(!res.ok) throw new Error(data.message||"Product save failed");
      setMessage(editingId?"Product updated successfully.":"Product added to MongoDB."); reset(); loadData(); refreshProducts?.();
    }catch(err){setMessage(err.message)}finally{setSaving(false)}
  };
  const edit=p=>{setEditingId(p._id);setForm({name:p.name||"",description:p.description||"",price:p.price??"",discountPrice:p.discountPrice??"",image:p.image||"",category:p.category?._id||p.category||"",stock:p.stock??"",brand:p.brand||""});window.scrollTo({top:0,behavior:"smooth"})};
  const remove=async id=>{
    if(!window.confirm("Delete this product?"))return;
    try{const res=await fetch(`${API}/product/delete/${id}`,{method:"DELETE"});const data=await res.json();if(!res.ok)throw new Error(data.message||"Delete failed");setMessage("Product deleted successfully.");setProducts(x=>x.filter(p=>p._id!==id))}
    catch(err){setMessage(err.message)}
    finally{refreshProducts?.();}
  };

  return <div className="admin-page">
    <div className="admin-head"><div><span className="admin-kicker">ADMIN</span><h1><i className="bi bi-speedometer2"/> Dashboard</h1><p>Products add, update aur delete karo. Data MongoDB me save hoga.</p></div><button className="admin-back" onClick={()=>navigate("/")}><i className="bi bi-house"/> Home</button></div>
    {message&&<div className="admin-message">{message}</div>}
    <div className="admin-grid">
      <section className="admin-form-card"><div className="card-title"><h2>{editingId?"Update Product":"Add New Product"}</h2>{editingId&&<button onClick={reset}>Cancel</button>}</div>
        <form onSubmit={submit}>
          <label>Product Name<input name="name" value={form.name} onChange={change} required/></label>
          <label>Brand<input name="brand" value={form.brand} onChange={change}/></label>
          <div className="two"><label>Price<input type="number" min="0" name="price" value={form.price} onChange={change} required/></label><label>Discount Price<input type="number" min="0" name="discountPrice" value={form.discountPrice} onChange={change}/></label></div>
          <div className="two"><label>Stock<input type="number" min="0" name="stock" value={form.stock} onChange={change}/></label><label>Category<select name="category" value={form.category} onChange={change} required><option value="">Select category</option>{categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></label></div>
          <label>Image URL<input name="image" value={form.image} onChange={change} placeholder="https://..."/></label>
          <label>Description<textarea name="description" value={form.description} onChange={change} rows="4" required/></label>
          <button className="save-product" disabled={saving}><i className={`bi ${editingId?"bi-pencil-square":"bi-plus-circle"}`}/>{saving?"Saving...":editingId?"Update Product":"Add Product"}</button>
        </form>
      </section>
      <section className="admin-list-card"><div className="card-title"><h2>Products <span>{products.length}</span></h2><button onClick={loadData}><i className="bi bi-arrow-clockwise"/></button></div>
        {loading?<div className="empty-admin">Loading...</div>:!products.length?<div className="empty-admin">No MongoDB products found.</div>:
        <div className="admin-products">{products.map(p=><div className="admin-product" key={p._id}><img src={p.image||PLACEHOLDER_IMAGE} alt={p.name}/><div className="admin-product-info"><h3>{p.name}</h3><p>{p.brand||"No brand"} · ₹{p.price} · Stock {p.stock}</p><small>{p.category?.name||"No category"}</small></div><div className="admin-product-actions"><button className="edit" onClick={()=>edit(p)}><i className="bi bi-pencil"/></button><button className="delete" onClick={()=>remove(p._id)}><i className="bi bi-trash3"/></button></div></div>)}</div>}
      </section>
    </div>
  </div>
};
export default AdminDashboard;
