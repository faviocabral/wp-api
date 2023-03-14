select top 1000 t1.itemcode codigo , t1.ItemName articulo , upper(t3.WhsName) ubicacion, case when t2.OnHand - t2.IsCommited > 0.0 then 'SI' else 'NO' end saldo , cast( t4.Price as int ) precio 
From OITM t1 
	join oitw t2 on t1.ItemCode = t2.ItemCode 
	join owhs t3 on t2.WhsCode = t3.WhsCode 
	join itm1 t4 on t1.ItemCode = t4.ItemCode and t4.PriceList = 4 
where ItmsGrpCod = 113
and t2.OnHand - t2.IsCommited > 0.0 
and t1.ItemCode = '86110-Q6-400'
